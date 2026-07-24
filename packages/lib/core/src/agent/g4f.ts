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

export class G4F implements ChatAgent {
    readonly name = 'g4f';
    readonly modelKey = getAgentUserConfigFieldName('G4F_CHAT_MODEL');

    readonly enable: AgentEnable = () => true;
    readonly model: AgentModel = ctx => ctx.G4F_CHAT_MODEL;
    readonly modelList: AgentModelList = ctx => loadModelsList(ctx.G4F_CHAT_MODELS_LIST, ctx.G4F_API_BASE, bearerHeader(g4fApiKey(ctx)));

    readonly request: ChatAgentRequest = async (params: LLMChatParams, context: AgentUserConfig, onStream: ChatStreamTextHandler | null): Promise<ChatAgentResponse> => {
        const { prompt, messages } = params;
        const url = `${context.G4F_API_BASE}/chat/completions`;
        const header = bearerHeader(g4fApiKey(context), onStream != null);

        // 基础请求体
        const body: any = {
            ...(context.G4F_CHAT_EXTRA_PARAMS || {}),
            model: context.G4F_CHAT_MODEL,
            messages: await renderOpenAIMessages(prompt, messages),
            stream: onStream != null,
        };

        // 如果启用了网络搜索，注入web_search工具
        if (context.G4F_ENABLE_WEB_SEARCH) {
            // 支持自定义web_search参数
            const webSearchParams = context.G4F_WEB_SEARCH_PARAMS || {};
            body.web_search = webSearchParams.enabled !== false;
            // 也可以通过tools方式实现搜索
            if (webSearchParams.use_tools) {
                body.tools = [
                    {
                        type: 'function',
                        function: {
                            name: 'web_search',
                            description: 'Search the internet for current information',
                            parameters: {
                                type: 'object',
                                properties: {
                                    query: {
                                        type: 'string',
                                        description: 'Search query',
                                    },
                                },
                                required: ['query'],
                            },
                        },
                    },
                ];
            }
        }

        return convertStringToResponseMessages(requestChatCompletions(url, header, body, onStream, null));
    };
}