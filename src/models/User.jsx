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
        Object.assign(this, data);
    }

    equals(user) {
        return (
            this.id === user.id &&
            this.username === user.username &&
            this.status === user.status &&
            this.token === user.token &&
            this.creationDate === user.creationDate &&
            this.quote === user.quote
        );
    }
}
export default User;
