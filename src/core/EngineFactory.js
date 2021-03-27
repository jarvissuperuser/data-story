import createEngine from '@projectstorm/react-diagrams';
import NodeModelFactory from './NodeModelFactory'
import DiagramModel from './DiagramModel'

export default class EngineFactory {
    static loadOrCreate(serializedModel = null) {
        return serializedModel ? this.load(serializedModel) : this.default();
    }

    static load(serializedModel) {
        let engine = this.getEngine()
        let model = new DiagramModel();
           
        model.deserializeModel(JSON.parse(serializedModel), engine);

        engine.setModel(model)

        return engine
    }

    static default() {        
        let engine = this.getEngine()
        
        const state = engine.getStateMachine().getCurrentState();
        state.dragNewLink.config.allowLooseLinks = false;

        engine.getNodeFactories().registerFactory(new NodeModelFactory());
        
        let model = new DiagramModel();
        
        engine.setModel(model)
        
        return engine        
    }

    static getEngine() {
        let engine = createEngine();
        
        engine.getNodeFactories().registerFactory(new NodeModelFactory());

        return engine
    }


}