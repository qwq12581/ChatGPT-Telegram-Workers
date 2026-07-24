# G4F 网络搜索功能说明

## 概述
G4F (g4f.space) 支持通过OpenAI兼容的tools参数实现网络搜索功能。这是一个**实验性功能**，目前支持通过Groq等免费端点使用。

## 功能状态
- **支持状态**：✅ 实验性支持（通过tools参数）
- **端点支持**：groq端点支持，其他端点可能不支持
- **API密钥要求**：groq端点不需要API密钥
- **稳定性**：实验性功能，可能不稳定

## 配置方法

### 1. 启用网络搜索
在环境变量中设置：
```json
{
  "AI_PROVIDER": "g4f",
  "G4F_API_BASE": "groq",
  "G4F_CHAT_MODEL": "llama-3.3-70b-versatile",
  "G4F_ENABLE_WEB_SEARCH": true
}
```

### 2. 通过Telegram命令设置
```bash
# 设置AI提供商为G4F
/setenv AI_PROVIDER=g4f

# 设置使用groq免费端点
/setenv G4F_API_BASE=groq

# 设置模型
/setenv G4F_CHAT_MODEL=llama-3.3-70b-versatile

# 启用网络搜索
/setenv G4F_ENABLE_WEB_SEARCH=true
```

## 工作原理

当启用网络搜索时，G4F代理会在请求体中添加以下参数：
```json
{
  "model": "llama-3.3-70b-versatile",
  "messages": [...],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "web_search",
        "description": "Search the internet for current information",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "Search query"
            }
          },
          "required": ["query"]
        }
      }
    }
  ],
  "tool_choice": "auto"
}
```

## 测试结果

### 测试1：groq端点 + tools参数
```bash
curl -s -X POST https://g4f.space/api/groq/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "搜索今天的AI新闻"}],
    "tools": [{
      "type": "function",
      "function": {
        "name": "web_search",
        "description": "Search the internet for current information",
        "parameters": {
          "type": "object",
          "properties": {
            "query": {
              "type": "string",
              "description": "Search query"
            }
          },
          "required": ["query"]
        }
      }
    }],
    "tool_choice": "auto"
  }'
```

**响应结果**：✅ 成功返回tool_calls
```json
{
  "id": "chatcmpl-1ca52700-3114-4700-892f-6c0705867875",
  "object": "chat.completion",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "tool_calls": [{
        "id": "j9vh2pt6x",
        "type": "function",
        "function": {
          "name": "web_search",
          "arguments": "{\"query\": \"today's AI news\"}"
        }
      }]
    },
    "finish_reason": "tool_calls"
  }]
}
```

### 测试2：groq端点 + web_search参数（不支持）
```bash
curl -s -X POST https://g4f.space/api/groq/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-versatile",
    "messages": [{"role": "user", "content": "搜索今天的AI新闻"}],
    "web_search": true
  }'
```

**响应结果**：❌ 不支持
```json
{
  "error": {
    "message": "property 'web_search' is unsupported",
    "type": "invalid_request_error"
  }
}
```

## 可用端点

### 免费端点（不需要API密钥）
1. **groq**: `https://g4f.space/api/groq`
   - 支持网络搜索：✅ 通过tools参数
   - 推荐模型：`llama-3.3-70b-versatile`

2. **ollama**: `https://g4f.space/api/ollama`
   - 支持网络搜索：⚠️ 未知（需要测试）

3. **pollinations**: `https://g4f.space/api/pollinations`
   - 支持网络搜索：⚠️ 未知（需要测试）

4. **nvidia**: `https://g4f.space/api/nvidia`
   - 支持网络搜索：⚠️ 未知（需要测试）

5. **gemini**: `https://g4f.space/api/gemini`
   - 支持网络搜索：⚠️ 未知（需要测试）

### 付费端点（需要API密钥）
1. **v1**: `https://g4f.space/v1`
   - 支持网络搜索：⚠️ 未知（需要测试）
   - 需要API密钥：✅

## 使用建议

### 1. 推荐配置
```json
{
  "AI_PROVIDER": "g4f",
  "G4F_API_BASE": "groq",
  "G4F_CHAT_MODEL": "llama-3.3-70b-versatile",
  "G4F_ENABLE_WEB_SEARCH": true,
  "SYSTEM_INIT_MESSAGE": "你是一个有帮助的AI助手，可以搜索网络获取最新信息。"
}
```

### 2. 使用场景
- ✅ **需要最新信息**：搜索新闻、天气、股票等实时信息
- ✅ **研究任务**：搜索学术资料、技术文档
- ✅ **事实核查**：验证信息的准确性
- ⚠️ **不适合**：简单的对话、不需要网络信息的任务

### 3. 注意事项
- **实验性功能**：网络搜索功能是实验性的，可能不稳定
- **响应格式**：模型会返回tool_calls而不是直接回答
- **工具调用**：需要客户端实现工具调用逻辑
- **替代方案**：如果网络搜索不稳定，可以关闭此功能

## 故障排除

### 问题1：网络搜索不工作
- 确认使用的是groq端点
- 检查模型是否支持tool_calls
- 查看错误日志

### 问题2：响应格式错误
- 确认G4F_ENABLE_WEB_SEARCH=true
- 检查API基础地址是否正确
- 尝试使用其他模型

### 问题3：API调用失败
- 确认网络连接正常
- 检查G4F服务状态
- 尝试使用其他端点

## 相关链接
- G4F官方文档：https://g4f.space
- 项目GitHub：https://github.com/qwq12581/ChatGPT-Telegram-Workers
- G4F API文档：https://g4f.space/docs

---
**最后更新**：2026-07-24  
**状态**：✅ 实验性功能，已验证groq端点支持