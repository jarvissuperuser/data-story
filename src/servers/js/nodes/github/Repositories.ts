import { deepStrictEqual } from "assert";
import { NodeDescription } from "../../../../core/NodeDescription";
import API from "../API";

export default class Repositories extends API {
    public static category: string = 'Github'
    public static summary = 'Fetch github repositores' 

    static describe() : NodeDescription {
        let description = super.describe()

        let urlParam = description.parameters.find(p => p.name == 'url')
        urlParam.default = 'https://api.github.com/users/ajthinking/repos'
        urlParam.value = 'https://api.github.com/users/ajthinking/repos'

        return description
    }    
}