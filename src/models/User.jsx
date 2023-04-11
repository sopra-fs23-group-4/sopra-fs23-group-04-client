/**
 * User model
 */
class User {
    constructor(data = {}) {
        this.id = null;
        this.username = null;
        this.status = null;
        this.token = null;
        this.creationDate = null;
        this.quote = null;
        this.picture = null;
        this.Object.assign(this, data);
    }
}
export default User;
