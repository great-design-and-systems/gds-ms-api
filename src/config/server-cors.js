'use strict';
function execute(app, cors) {
    app.use(cors({
        origin: true,
        credentials: true
    }));
}

module.exports = execute;