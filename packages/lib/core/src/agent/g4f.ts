import type { AgentUserConfig } from '#/config';
import type {
    AgentEnable,
    AgentModel,
    AgentModelList,
    ChatAgent,
    ChatAgentRequest,
    ChatAgentResponse,
    ChatStreamTextHandler,
    LLMChatParams,
} from '#/agent/types';
import { requestChatCompletions } from '#/agent/request';
import { bearerHeader, convertStringToResponseMessages, getAgentUserConfigFieldName, loadModelsList } from '#/agent/utils';
import { renderOpenAIMessages } from '#/agent/openai_compatibility';

function g4fApiKey(context: AgentUserConfig): string {
    if (!context.G4F_API_KEY || context.G4F_API_KEY.length === 0) {
        return '';
    }
    const length = context.G4F_API_KEY.length;
    return context.G4F_API_KEY[Math.floor(Math.random() * length)];
}

// G4F 端点配置
const G4F_ENDPOINTS = {
    'v1': 'https://g4f.space/v1', // 需要API密钥，支持web_search和全部模型
    'gemini': 'https://g4f.space/api/gemini/v1', // 免费，不需要密钥，仅支持Gemini模型
    'groq': 'https://g4f.space/api/groq', // 免费，不需要密钥
    'ollama': 'https://g4f.space/api/ollama', // 免费，不需要密钥
    'pollinations': 'https://g4f.space/api/pollinations', // 免费，不需要密钥
    'nvidia': 'https://g4f.space/api/nvidia', // 免费，不需要密钥
    'auto': 'https://g4f.space/api/auto', // 免费，自动选择
};

export class G4F implements ChatAgent {
    readonly name = 'g4f';
    readonly modelKey = getAgentUserConfigFieldName('G4F_CHAT_MODEL');

    readonly enable: AgentEnable = () => true;
    readonly model: AgentModel = ctx => ctx.G4F_CHAT_MODEL;
    readonly modelList: AgentModelList = ctx => loadModelsList(ctx.G4F_CHAT_MODELS_LIST, ctx.G4F_API_BASE, bearerHeader(g4fApiKey(ctx)));

    readonly request: ChatAgentRequest = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<ChatAgentResponse> => {
        const { prompt, messages } = params;
        
        // 确定API基础地址
        let apiBase = context.G4F_API_BASE;
        // 如果是自定义端点名称，转换为实际URL
        if (G4F_ENDPOINTS[apiBase as keyof typeof G4F_ENDPOINTS]) {
            apiBase = G4F_ENDPOINTS[apiBase as keyof typeof G4F_ENDPOINTS];
        }
        
        const url = `${apiBase}/chat/completions`;
        const header = bearerHeader(g4fApiKey(context), onStream != null);

        // 基础请求体
        const body: any = {
            ...(context.G4F_CHAT_EXTRA_PARAMS || {}),
            model: context.G4F_CHAT_MODEL,
            messages: await renderOpenAIMessages(prompt, messages),
            stream: onStream != null,
        };

        // 如果启用了网络搜索，添加web_search参数 (仅/v1端点支持，需配合Gemini系列模型)
        if (context.G4F_ENABLE_WEB_SEARCH) {
            body.web_search = true;
        }

        return convertStringToResponseMessages(requestChatCompletions(url, header, body, onStream, null));
    };
}