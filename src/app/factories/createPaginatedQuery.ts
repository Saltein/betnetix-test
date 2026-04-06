// factories/createPaginatedQuery.ts
import { type BaseQueryFn } from "@reduxjs/toolkit/query/react";

interface PaginatedParams {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}

interface EndpointConfig<TItem, TTransformed = TItem> {
    /** Базовый URL коллекции, например '/posts' */
    baseUrl: string;
    /** Функция для построения полного URL с учётом search, sort, pagination */
    buildUrl?: (
        params: PaginatedParams & { skip: number; limit: number },
    ) => string;
    /** Преобразование одного элемента (например, подгрузка связанных данных) */
    transformItem?: (
        item: TItem,
        helpers: {
            baseQuery: BaseQueryFn;
            api: any;
            cache: Record<string | number, any>;
        },
    ) => Promise<TTransformed>;
    /** Максимальный размер одного "быстрого" батча (для фоновой загрузки) */
    batchSize?: number;
    /** Включить фоновую дозагрузку (если лимит > batchSize или limit === 0) */
    enableBackgroundLoad?: boolean;
    /** Максимальное количество повторных попыток при ошибке 429 */
    maxRetries?: number;
    /** Задержка между повторными попытками (ms) */
    retryDelay?: number;
}

export function createPaginatedQuery<TItem, TTransformed = TItem>(
    config: EndpointConfig<TItem, TTransformed>,
) {
    const {
        baseUrl,
        buildUrl: customBuildUrl,
        transformItem,
        batchSize = 25,
        enableBackgroundLoad = true,
        maxRetries = 3,
        retryDelay = 2000,
    } = config;

    // Функция построения URL по умолчанию (подходит для DummyJSON)
    const defaultBuildUrl = ({
        search,
        sortBy,
        order,
        skip,
        limit,
    }: PaginatedParams & { skip: number; limit: number }) => {
        let url = search ? `${baseUrl}/search?q=${search}` : baseUrl;
        url += `?limit=${limit}&skip=${skip}`;
        if (sortBy) {
            url += `&sortBy=${sortBy}&order=${order ?? "asc"}`;
        }
        return url;
    };

    const buildUrl = customBuildUrl ?? defaultBuildUrl;

    return <
        TQueryArg extends PaginatedParams,
        TReturn = { posts: TTransformed[]; total: number }, // можно переименовать posts в data, но оставим совместимость
    >(
        builder: any,
    ) =>
        builder.query<TReturn, TQueryArg>({
            async queryFn(params, api, _extra, baseQuery) {
                const { page, limit, search, sortBy, order } = params;

                // Хелпер для выполнения запроса с ретраями
                const fetchBatch = async (
                    skip: number,
                    take: number,
                    retries = maxRetries,
                ): Promise<{ items: TItem[]; total: number }> => {
                    const url = buildUrl({ ...params, skip, limit: take });
                    const result = await baseQuery({ url });
                    if (
                        result.error &&
                        (result.error as any)?.status === 429 &&
                        retries > 0
                    ) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, retryDelay),
                        );
                        return fetchBatch(skip, take, retries - 1);
                    }
                    if (result.error) throw result.error;
                    const data = result.data as any;
                    return {
                        items: data.posts ?? data.users ?? data,
                        total: data.total,
                    };
                };

                // Хелпер для обогащения массива элементов
                const enrichItems = async (
                    items: TItem[],
                    cache: Record<string | number, any>,
                ) => {
                    if (!transformItem)
                        return items as unknown as TTransformed[];
                    const enriched = await Promise.all(
                        items.map((item) =>
                            transformItem(item, { baseQuery, api, cache }),
                        ),
                    );
                    return enriched;
                };

                const needFastLoad =
                    enableBackgroundLoad && (limit > batchSize || limit === 0);

                // ---- Простой случай (без фоновой загрузки) ----
                if (!needFastLoad) {
                    const skip = (page - 1) * limit;
                    try {
                        const { items, total } = await fetchBatch(skip, limit);
                        const cache = {};
                        const transformed = await enrichItems(items, cache);
                        return {
                            data: { posts: transformed, total } as TReturn,
                        };
                    } catch (error) {
                        return { error: error as any };
                    }
                }

                // ---- С фоновой дозагрузкой ----
                const effectiveSkip = limit === 0 ? 0 : (page - 1) * limit;
                let firstBatch;
                try {
                    firstBatch = await fetchBatch(effectiveSkip, batchSize);
                } catch (error) {
                    return { error: error as any };
                }

                const { items: firstItems, total } = firstBatch;
                const cache = {};
                const transformedFirst = await enrichItems(firstItems, cache);
                const result = {
                    data: { posts: transformedFirst, total } as TReturn,
                };

                let remainingLimit: number;
                if (limit === 0) {
                    remainingLimit = total - batchSize;
                } else {
                    remainingLimit = limit - batchSize;
                }

                // Фоновая загрузка (не блокирует ответ)
                if (remainingLimit > 0) {
                    (async () => {
                        try {
                            let nextSkip = effectiveSkip + batchSize;
                            let loaded = batchSize;
                            let allItems = [...transformedFirst];
                            const backgroundCache = { ...cache };
                            let currentRemaining = remainingLimit;

                            while (currentRemaining > 0) {
                                const take = Math.min(
                                    currentRemaining,
                                    batchSize,
                                );
                                let batch = await fetchBatch(nextSkip, take);
                                const enrichedBatch = await enrichItems(
                                    batch.items,
                                    backgroundCache,
                                );
                                allItems = [...allItems, ...enrichedBatch];
                                loaded += take;
                                currentRemaining -= take;
                                nextSkip += take;

                                // Обновляем кэш RTK Query
                                api.dispatch(
                                    api.util.updateQueryData(
                                        (api as any).endpoint,
                                        params,
                                        (draft: any) => {
                                            draft.posts = allItems;
                                            draft.total = total;
                                        },
                                    ),
                                );
                            }
                        } catch (err) {
                            console.error("Background loading failed:", err);
                        }
                    })();
                }

                return result;
            },
        });
}
