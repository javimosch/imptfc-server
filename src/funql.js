import funql from "funql-api";
import sander from "sander";
import path from "path";

export default async function(app) {

    app.use((req, res, next) => {
        req.action = (path = "") => {
            if (!path) {
                throw new Error("path required");
            } else {
                let root = app.api;
                path.split(".").forEach(k => {
                    if (!!root[k]) root = root[k];
                    else return false;
                });
                if (typeof root === "function") {
                    return function() {
                        return root.apply({
                                req,
                                db: req.db
                            },
                            arguments
                        );
                    };
                } else {
                    throw new Error("ACTION_NOT_FOUND=" + path);
                }
            }
        };
        next();
    });

    //Normal usage: call the middleware
    await funql.middleware(app, {
        /*defaults*/
        getMiddlewares: [],
        postMiddlewares: [function(req, res, next) {
            let ns = req.body.ns || req.body.namespace || ""
            if (ns === 'helpers') {
                res.json({
                    err: 401
                })
            }
        }],
        allowGet: true,
        allowOverwrite: true,
        attachToExpress: true,
        allowCORS: true,
        bodyParser: true, //required for http post
        api: {
            //default actions
        }
    });

    await loadActionsFromFolder('helpers', {
        namespace: 'helpers'
    })
    await loadActionsFromFolder('public_actions', {
        namespace: 'public'
    })

    async function loadActionsFromFolder(folderPath, options = null) {
        const { namespace } = (options || {
            namespace: ""
        })
        await Promise.all((await sander.readdir(path.join(process.cwd(), 'src', folderPath))).map(dir => {
            return (async function() {
                let module = await
                import (path.join(process.cwd(), 'src', folderPath, dir))
                let fnName = dir.split('.')[0]
                app.api[namespace] = app.api[namespace] || {}
                app.api[fnName] = module.default && module.default(app) || module(app)
                console.log(`Function ${fnName} loaded into `, namespace)
            })();
        }))
    }

    /*await funql.loadFunctionsFromFolder({
        namespace: 'helpers',
        path: path.join(process.cwd(), 'src/helpers'),
        middlewares: [async function() {
            if (this.req) {
                return { err: 401 }
            }
        }]
    })*/

    sander.readdir(path.join("src/routes")).then(dirs => {
        dirs.forEach(async dir => {
            let module = await
            import (`./routes/${dir}`);
            let singularName = dir.split(".")[0];
            module = module.default;
            if (module.actions) {
                Object.keys(module.actions).forEach(key => {
                    app.api[singularName] = app.api[singularName] || {};
                    app.api[singularName][key] = module.actions[key];
                });
            }
        });
    });


    /*
        sander.readdir(path.join('src/routes')).then(dirs => {
            dirs.forEach(async dir => {
                let module = await
                import (`./routes/${dir}`)
                let singularName = dir.split('.')[0]
                module = module.default
                if (module.actions) {
                    Object.keys(module.actions).forEach(key => {
                        app.api[singularName] = app.api[singularName] || {}
                        app.api[singularName][key] = module.actions[key]
                    })
                }
            })
        })*/

}