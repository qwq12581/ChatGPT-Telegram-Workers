# G4F (g4f.space) 使用说明

## 概述
G4F是一个免费的AI服务提供商，提供OpenAI兼容的API接口，无需API密钥即可使用。

## 配置方法

### 1. 环境变量配置
在Cloudflare Workers配置界面或本地配置文件中设置以下环境变量：

```json
{
  "AI_PROVIDER": "g4f",
  "G4F_API_BASE": "https://g4f.space/v1",
  "G4F_CHAT_MODEL": "gpt-4o",
  "G4F_CHAT_MODELS_LIST": "",
  "G4F_CHAT_EXTRA_PARAMS": {}
}
```

### 2. 可用模型
G4F支持多种模型，包括：
- `gpt-4o` - GPT-4o模型（推荐）
- `gpt-3.5-turbo` - GPT-3.5 Turbo模型
- `gpt-4` - GPT-4模型
- 其他OpenAI兼容模型

### 3. 使用步骤

1. **设置AI提供商**：
   ```
   /setenv AI_PROVIDER=g4f
   ```

2. **设置API基础地址**（可选，默认已设置）：
   ```
   /setenv G4F_API_BASE=https://g4f.space/v1
   ```

3. **设置模型**（可选）：
   ```
   /setenv G4F_CHAT_MODEL=gpt-4o
   ```

4. **开始使用**：直接发送消息即可使用G4F服务

### 4. 特点
- ✅ **无需API密钥**：G4F服务通常不需要API密钥（使用免费端点时）
- ✅ **免费使用**：完全免费的AI服务
- ✅ **OpenAI兼容**：与OpenAI API完全兼容
- ✅ **多模型支持**：支持多种AI模型
- ⚠️ **网络搜索**：支持通过tools参数实现网络搜索（实验性功能）

### 5. 注意事项
- G4F服务可能有使用限制或速率限制
- 服务稳定性可能不如官方OpenAI API
- 建议不要在生产环境中完全依赖此服务
- 可能存在响应延迟或服务不可用的情况

## 示例配置

### 基础配置
```json
{
  "AI_PROVIDER": "g4f",
  "G4F_CHAT_MODEL": "gpt-4o",
  "SYSTEM_INIT_MESSAGE": "你是一个有帮助的AI助手。"
}
```

### 完整配置示例
```json
{
  "TELEGRAM_AVAILABLE_TOKENS": "YOUR_TELEGRAM_BOT_TOKEN",
  "CHAT_WHITE_LIST": "YOUR_USER_ID",
  "AI_PROVIDER": "g4f",
  "G4F_API_BASE": "https://g4f.space/v1",
  "G4F_CHAT_MODEL": "gpt-4o",
  "SYSTEM_INIT_MESSAGE": "你是一个有帮助的AI助手，请用中文回答。",
  "I_AM_A_GENEROUS_PERSON": false
}
```

## 故障排除

### 问题1：无法连接到G4F服务
- 检查网络连接
- 确认G4F服务是否可用
- 尝试使用其他模型

### 问题2：响应质量不佳
- 尝试更换其他模型
- 调整系统初始化消息
- 检查G4F服务状态

### 问题3：API调用失败
- 确认API基础地址是否正确
- 检查模型名称是否正确
- 查看错误日志

## 相关链接
- G4F官方文档：https://g4f.space
- 项目GitHub：https://github.com/qwq12581/ChatGPT-Telegram-Workers