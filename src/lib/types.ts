export interface Tweet {
    id: string;
    date: string;
    category: string;
    type: string;
    topic: string;
    url: string;
    metrics: {
        views: number;
        likes: number;
        retweets: number;
        replies: number;
        bookmarks: number;
    };
}
