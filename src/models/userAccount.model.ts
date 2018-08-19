export interface UserAccount {
    id: string;
    watchlist: string[];
    favourites: string[];
    ratings: [
        {
            movieId: number;
            rating: number;
        }
    ];
}
