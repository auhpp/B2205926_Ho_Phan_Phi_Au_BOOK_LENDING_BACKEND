class ReaderRepository {
    constructor(client) {
        this.Reader = client.db().collection("DOC_GIA");
    }

    async findByUserName(userName) {
        return await this.Reader.findOne({
            userName: userName
        });
    }
}

export default ReaderRepository;