# MCP 서버 구현기 (2)

지난 포스팅에서 AI Agent 와 MCP 서버를 연동해보았다.  
예제 코드를 보며 MCP 서버의 주요 기능에 대해 알아보자.

::: details 예제 코드 {close}

```ts [src/server.ts]
import {
    McpServer,
    ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// Create an MCP server
const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0',
});

// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
        content: [{ type: 'text', text: String(a + b) }],
    })
);

// Add a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource', // Display name for UI
        description: 'Dynamic greeting generator',
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                text: `Hello, ${name}!`,
            },
        ],
    })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
server.connect(transport);
```

:::

예제 코드의 주석을 보면 대충 알 수 있듯이, MCP 서버는 도구(Tool), 리소스 (Resource) 와 같은 기본 구성 요소를 크게 세가지 제공한다.

1. Tools
2. Resource
3. Prompts

## Tools

##

## Prompts

프롬프트는 LLM 에게 미리 준비된 지시사항을 제공하는 기능이다.

프롬프트는 서버가 클라이언트에 프롬프트 템플릿을 노출하는 표준화된 방식을 제공한다.
프롬프트르 통해 서버는 언어 모델과 상호 작용하기 위한 구조화된 메시지와 지침을 제공할 수 있다.  
클라이언트는 사용 가능한 프롬프트를 검색하고, 내용을 가져오고, 인수를 제공하여 프롬프트를 사용자 지정할 수 있다.

## Transports

```ts [src/server.ts]
// Create an MCP server
const server = new McpServer({
    name: 'demo-server',
    version: '1.0.0',
});

// ...생략

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
server.connect(transport); // [!code warning]
```

서버 시작 부분을 보면, `StdioServerTransport` 를 `connect` 의 인자로 전달하고 있다.  
`StdioServerTransport` 란 무엇일까?

Transports 란, <b>MPC 클라이언트와 MPC 서버 간의 통신 방법을 정의하는 계층(프로토콜)</b>이다.  
현 MCP 는 두 가지 Transports 를 제공한다.

1. stdio (Standard Input/Output) Transports
2. Streamable https

### stdio (Standard Input/Output) Transports

표준 입력/출력을 통한 통신이다.  
가장 간단하고 일반적인 방식이다.
