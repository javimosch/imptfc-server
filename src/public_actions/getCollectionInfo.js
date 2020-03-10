import mongoose from 'mongoose'
import pluralize from 'pluralize'
export default function(app) {
    return async function getCollectionInfo(name) {
        let singular = pluralize.singular((name||""))
        let info= (mongoose.model(singular)||{}).schema
        info.plural = pluralize(name)
        return info;
    }
}