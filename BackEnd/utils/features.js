class features {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search (){
        const keyword = this.queryStr.keyword ?{
            name: {
                $regex: this.queryStr.keyword,
                $options: 'i' //makes sure na ung search is hindi case sensitive
            }
        }: {}

        console.log(keyword)

        this.query = this.query.find({ ...keyword });
        return this;
    }
    filter() {
        const queryCopy = { ...this.queryStr };
    
        // Removing fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el]);
    
        
    
        // Advanced filter for numeric fields (e.g., gt, gte, lt, lte)
        let queryStr = JSON.stringify(queryCopy); // Convert the object to a JSON string
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); 
        /*
        so nag add ako ng dollar sign katabi ng ${match} 
        kasi pag sa DB need ng dollar sign ng DB para sa mga comparison operators
        */
    
        // Convert queryStr back to an object and assign to this.query
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = (currentPage - 1) * resPerPage; 
        /*Ito is ung nagsasabi how many products do we skip 
        when we transfer from 1 page to another */

        this.query = this.query.limit(resPerPage).skip(skip)
        return this;
    }
}    


module.exports = features