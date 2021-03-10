import Axios from "axios";
import { NodeDescription } from "../../../core/NodeDescription";
import ServerNode from "../ServerNode";
import axios from 'axios';
import { features } from "process";
import Feature from "../../../core/Feature";

export default class HTTPRequest extends ServerNode {
    public static category: string = 'Reader'
    public static inPorts: Array<string> = ['Input']
    public static summary = 'Make a HTTP request'

    async run() {
        for await (let feature of this.input()) {
            await this.request(feature).then((result) => {
                this.output(result.data.map(i => new Feature(i)))
            })
        }                
    }

    static describe() : NodeDescription {
        let description = super.describe()

        description.parameters.push(
            {
                name: 'url',
                fieldType: 'String_',
                default: 'https://jsonplaceholder.typicode.com/todos',
                value: 'https://jsonplaceholder.typicode.com/todos',
            },
            {
                default: 'GET',
                fieldType: 'String_',
                name: 'verb',
                value: 'GET',
            },
            {
                name: 'data',
                fieldType: 'JSON_',
                default: '{}',
                value: '{}',
            },
            {
                name: 'config',
                fieldType: 'JSON_',
                default: JSON.stringify({}),
                value: JSON.stringify({}),
            },                                   
        )

        return description
    }

    protected request(feature) {
        if(this.getParameterValue('verb') == 'GET') {
            return axios.get(
                this.getParameterValue('url'),
                this.getParameterValue('config')
            )
        }

        // if(this.getParameterValue('verb') == 'POST') {
        //     return axios.post(
        //         this.getParameterValue('config'),
        //         this.getParameterValue('config'),
        //         this.getParameterValue('config')
        //     )   
        // }

        // if(this.getParameterValue('verb') == 'DELETE') {
        //     return axios.delete(
        //         feature.url,
        //         feature.config
        //     )   
        // }        
    } 
}