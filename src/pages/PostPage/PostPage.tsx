import type { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

interface PostPageProps {}

export const PostPage: FunctionComponent<PostPageProps> = () => {
    const { id } = useParams();
    return <div>PostPage {id}</div>;
};
