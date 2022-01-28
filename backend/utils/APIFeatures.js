class APIFeatures{
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    search(){
        const keyword = this.queryString.keyword ? {
            // If does exist in DB then search in DB:
            name:{
                $regex: this.queryString.keyword,
                $options: 'i' // Case insensitive
            }
        }: {

        };

        this.query = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryCopy = { ...this.queryString };

        // Removing from query the fields which are not related to filtering:
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el=> delete queryCopy[el]);

        // Advanced Filters (Price range, min Ratings, etc.):
        let queryString = JSON.stringify(queryCopy);
        // regex for adding $ before price range query terms (gt,gtw,lt,lte):
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match=> `$${match}`);

        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }
}

module.exports = APIFeatures;