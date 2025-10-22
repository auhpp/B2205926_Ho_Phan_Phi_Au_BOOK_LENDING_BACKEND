class ReaderRepository {
    constructor(client) {
        this.Book = client.db().collection("SACH");
    }

    extractStaffData(payload) {
        const staff = {
            name: payload.name,
            price: payload.price,
            yearOfPublication: payload.yearOfPublication,
            authorId: payload.authorId,
            categoryId: payload.categoryId,
            images: payload.images
        };

        Object.keys(staff).forEach(
            key => staff[key] == undefined && delete staff[key]
        );
        return staff;
    }

    
}

export default ReaderRepository;