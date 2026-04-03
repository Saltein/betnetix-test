export type Post = {
    id: number;
    title: string;
    body: string;
    tags: string[];
    reactions: { likes: number; dislikes: number };
    views: number;
    userId: number;
};

export interface GetAllPostResponse {
    id: number;
    body: string;
    likes: number;
    views: number;
    comments: number;
    user: {
        image: string;
        firstName: string;
        lastName: string;
    };
}
