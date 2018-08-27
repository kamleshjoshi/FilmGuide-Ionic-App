export interface SearchResult {
    page: number;
    results: [
        {
            id: number;
            title: string;
            poster_path: string;
            overview: string;
        }
    ];
}
