import { OpenAICompatibilityAgent } from '#/agent/openai_compatibility';

export class G4F extends OpenAICompatibilityAgent {
    constructor() {
        super('g4f', {
            base: 'G4F_API_BASE',
            key: 'G4F_API_KEY',
            model: 'G4F_CHAT_MODEL',
            modelsList: 'G4F_CHAT_MODELS_LIST',
            extraParams: 'G4F_CHAT_EXTRA_PARAMS',
        });
    }
}