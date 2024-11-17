module.exports = func => (req, res, next) =>
    Promise.resolve(func(req, res, next))
            .catch(next)
//this code makes sure na if habang nag run ung function (func(req, res, next) ay ma handle ung error
//using the automatic error handling of express the one with mongoose na dineclare ko kanina sa schema 




