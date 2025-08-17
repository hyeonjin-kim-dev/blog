---
prev:
    text: 'MCP 서버 구현기 (1)'
    link: '/docs/mcp/mcp1'
next:
    text: 'MCP 서버 구현기 (3)'
    link: '/docs/mcp/mcp3'
---

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

MCP 서버는 세 가지 기본 구성 요소를 제공한다.

1. Tools
2. Resource
3. Prompts

## Tools

도구란, LLM이 호출할 수 있는 기능을 의미한다.  
데이터 베이스 쿼리, API 호출, 계산 등 다양한 작업을 수행할 수 있다.

LLM 은 사용자의 프롬프트를 통해 상황을 이해하고, 도구를 알아서 검색하고 호출한다.

즉, 쉽게 설명하면 LLM 이 사용하는 함수(Method) 집합 같은 것이다.

```ts [src/server.ts]
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
```

위 코드는, 예제 코드의 도구 등록 부분이다.  
[`registerTool`](https://github.com/modelcontextprotocol/typescript-sdk/blob/4a63974049e27efb3c99325b29454127eed33adf/src/server/mcp.ts#L923) 이라는 메서드를 사용했는데, 메서드 정의는 아래와 같다.

```ts [mcp.d.ts]
/**
* Registers a tool with a config object and callback.
*/
registerTool<InputArgs extends ZodRawShape, OutputArgs extends ZodRawShape>(name: string, config: {
    title?: string;
    description?: string;
    inputSchema?: InputArgs;
    outputSchema?: OutputArgs;
    annotations?: ToolAnnotations;
}, cb: ToolCallback<InputArgs>): RegisteredTool;
```

하나하나 뜯어보며 코드를 이해해보자.

```ts [src/server.ts]
// Add an addition tool
server.registerTool(
    'add', // [!code ++]
    {
        title: 'Addition Tool', // [!code ++]
        description: 'Add two numbers', // [!code ++]
        inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
        content: [{ type: 'text', text: String(a + b) }],
    })
);
```

먼저, 이 도구의 이름은 `add` 이고, 두 수를 더하는 기능을 한다.

```ts [src/server.ts]
// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() }, // [!code ++]
    },
    async ({ a, b }) => ({
        content: [{ type: 'text', text: String(a + b) }],
    })
);
```

`inputSchema` 를 보면 `a` 와 `b` 라는 두 개의 숫자형 인자를 받는 것을 알 수 있다.  
여기서 `z` 는 `zod` 라이브러리이다. `zod` 는 타입스크립트에서 런타임 스키마를 정의/검증한다.
`z.number()` 는 숫자형 값을 나타내는 스키마를 정의한다. 
 
즉, `inputSchema` 에 정의된 `a` 와 `b` 는 모두 숫자형 값이어야 한다는 의미이다.

```ts [src/server.ts]
// Add an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers',
        inputSchema: { a: z.number(), b: z.number() },
    },
    async ({ a, b }) => ({
        // [!code ++]
        content: [{ type: 'text', text: String(a + b) }], // [!code ++]
    }) // [!code ++]
);
```

콜백 부분을 보면, `a` 와 `b` 를 더한 결과를 문자열로 변환하여 `content` 배열에 담아 반환한다.  
`a` 와 `b` 사용자가 입력한 프롬프트를 통해 LLM 이 유추하여 제공하는 값이다.  
`content` 에 담아 반환하는 이유는, 콜백 함수의 결과가 [`CallToolResultSchema`](https://github.com/modelcontextprotocol/typescript-sdk/blob/4a63974049e27efb3c99325b29454127eed33adf/src/types.ts#L957) 타입을 따라야하기 떄문이다.

::: details CallToolResultSchema {close}
::: code-group

```ts [types.ts]
/**
 * 도구 호출에 대한 서버의 응답을 나타냅니다.
 */
export const CallToolResultSchema = ResultSchema.extend({
    /**
     * 도구 호출 결과를 나타내는 content 객체의 배열입니다.
     *
     * Tool이 outputSchema를 정의하지 않은 경우, 이 필드는 반드시 결과에 포함되어야 합니다.
     * 하위 호환성을 위해 항상 존재하지만, 비어 있을 수 있습니다.
     */
    content: z.array(ContentBlockSchema).default([]),

    /**
     * 구조화된 도구 출력을 담는 객체입니다.
     *
     * Tool이 outputSchema를 정의한 경우, 이 필드는 반드시 결과에 포함되어야 하며,
     * 해당 스키마와 일치하는 JSON 객체여야 합니다.
     */
    structuredContent: z.object({}).passthrough().optional(),

    /**
     * 도구 호출이 에러로 종료되었는지 여부입니다.
     *
     * 설정되지 않은 경우, 기본값은 false(호출 성공)로 간주합니다.
     *
     * 도구에서 발생한 에러는 result 객체 내에 isError를 true로 설정하여 보고해야 하며,
     * MCP 프로토콜 레벨의 에러 응답으로 처리하지 않아야 합니다.
     * 그렇지 않으면 LLM이 에러 발생 사실을 인지하고 스스로 수정할 수 없습니다.
     *
     * 단, 도구을 찾지 못했거나, 서버가 도구 호출을 지원하지 않는 등 예외적인 상황에서는
     * MCP 에러 응답으로 보고해야 합니다.
     */
    isError: z.optional(z.boolean()),
});
```

```ts [ContentBlockSchema]
/**
 * A content block that can be used in prompts and tool results.
 */
export const ContentBlockSchema = z.union([
    TextContentSchema,
    ImageContentSchema,
    AudioContentSchema,
    ResourceLinkSchema,
    EmbeddedResourceSchema,
]);
```

```ts [TextContentSchema]
/**
 * Text provided to or from an LLM.
 */
export const TextContentSchema = z
    .object({
        type: z.literal('text'),
        /**
         * The text content of the message.
         */
        text: z.string(),

        /**
         * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
         * for notes on _meta usage.
         */
        _meta: z.optional(z.object({}).passthrough()),
    })
    .passthrough();
```

:::

## Resources

리소스는 MCP 에서 파일, 데이터베이스 스키마 같은 정보 단위를 나타낸다.  
각 리소스는 고유한 URI 로 식별된다.

사용자가 프롬프트로 어떤 정보를 요청할 때, LLM 은 해당 정보를 제공하는 리소스를 검색하고 사용자에게 제공한다.  
또는, LLM 은 어떤 도구 수행에 있어 필요한 정보를 얻기 위해 리소스를 알아서 검색하기도 한다.

즉, 쉽게 설명하면 LLM 이 어떤 동작을 하기 위해 찾는 정보 창고 같은 것이다.

```ts [src/server.ts]
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
```

위 코드는 예제 코드의 리소스 등록 부분이다.  
[`registerResource`](https://github.com/modelcontextprotocol/typescript-sdk/blob/4a63974049e27efb3c99325b29454127eed33adf/src/server/mcp.ts#L616) 메서드를 사용하여 새로운 리소스를 등록하고 있다.

::: details registerResource {close}

```ts [mcp.d.ts]
/**
* Registers a resource with a config object and callback.
* For static resources, use a URI string. For dynamic resources, use a ResourceTemplate.
*/
registerResource(
    name: string,
    uriOrTemplate: string,
    config: ResourceMetadata,
    readCallback: ReadResourceCallback
): RegisteredResource;

```

:::

코드를 하나하나 뜯어보면서 살펴보자.

```ts [src/server.ts]
// Add a dynamic greeting resource
server.registerResource(
    'greeting', // [!code ++]
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource', // Display name for UI // [!code ++]
        description: 'Dynamic greeting generator', // [!code ++]
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
```

이 리소스는 `greeting` 이라는 이름을 가지고 있고, 동적 인사말 생성 기능을 제공한다.

```ts [src/server.ts]
// Add a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }), // [!code ++]
    {
        title: 'Greeting Resource', // Display name for UI ++]
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
```

`uriOrTemplate` 에 [`ResourceTemplate`](https://github.com/modelcontextprotocol/typescript-sdk/blob/4a63974049e27efb3c99325b29454127eed33adf/src/server/mcp.ts#L1092) 이 사용되었다.

:::details ResourceTemplate {close}

```ts [mcp.d.ts]
/**
 * 리소스 템플릿은 URI 패턴과, 해당 패턴에 일치하는 모든 리소스를 열거하는 기능(선택적)을 결합한 클래스입니다.
 */
export declare class ResourceTemplate {
    private _callbacks;
    private _uriTemplate;
    constructor(
        uriTemplate: string | UriTemplate,
        _callbacks: {
            /**
             * 이 템플릿과 일치하는 모든 리소스를 나열하는 콜백입니다. 실수로 리소스 나열을 빠뜨리는 것을 방지하기 위해, `undefined`라도 반드시 지정해야 합니다.
             */
            list: ListResourcesCallback | undefined;
            /**
             * URI 템플릿 내 변수의 자동완성을 위한 선택적 콜백입니다. 클라이언트와 사용자가 가능한 값을 쉽게 찾을 수 있도록 도와줍니다.
             */
            complete?: {
                [variable: string]: CompleteResourceTemplateCallback;
            };
        }
    );
    /**
     * URI 템플릿 패턴을 반환합니다.
     */
    get uriTemplate(): UriTemplate;
    /**
     * list 콜백(있을 경우)을 반환합니다.
     */
    get listCallback(): ListResourcesCallback | undefined;
    /**
     * 특정 URI 템플릿 변수에 대한 complete 콜백(있을 경우)을 반환합니다.
     */
    completeCallback(
        variable: string
    ): CompleteResourceTemplateCallback | undefined;
}
```

:::

`ResourceTemplate` 을 통해 URI 패턴과 리소스 템플릿을 정의한 것을 알 수 있다.  
`'greeting://{name}'` 패턴에서 보이는 중괄호는, 동적인 값을 나타낸다.  
이 동적인 값은 LLM 이 사용자의 프롬프트를 통해 유추하여 제공하는 값이다.  
동적인 값은 한 URI 에 여러개 있을 수 있다.

```ts [src/server.ts]
// Add a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource', // Display name for UI ++]
        description: 'Dynamic greeting generator',
    },
    async (uri, { name }) => ({
        // [!code ++]
        // [!code ++]
        contents: [
            // [!code ++]
            {
                // [!code ++]
                uri: uri.href, // [!code ++]
                text: `Hello, ${name}!`, // [!code ++]
            }, // [!code ++]
        ], // [!code ++]
    }) // [!code ++]
);
```

`readCallback` 부분을 보면, `uri`와 `name`을 인자로 받아서, `contents` 배열을 반환하는 비동기 함수가 정의되어 있다.  
`contents` 에 담아 반환하는 이유는, `ReadResourceCallback` 의 결과인 [`ReadResourceResultSchema`](https://github.com/modelcontextprotocol/typescript-sdk/blob/4a63974049e27efb3c99325b29454127eed33adf/src/types.ts#L590) 타입을 따라야하기 떄문이다.

::: details ReadResourceTemplateCallback {close}
::: code-group

```ts [ReadResourceTemplateCallback]
/**
 * 채워진 URI 템플릿에 따라 특정 URI의 리소스를 읽는 콜백입니다.
 */
export type ReadResourceTemplateCallback = (
    uri: URL,
    variables: Variables,
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>
) => ReadResourceResult | Promise<ReadResourceResult>;

/**
 * 클라이언트의 resources/read 요청에 대한 서버의 응답 타입입니다.
 */
export type ReadResourceResult = Infer<typeof ReadResourceResultSchema>;

/**
 * 클라이언트의 resources/read 요청에 대한 서버의 응답 스키마입니다.
 */
export const ReadResourceResultSchema = ResultSchema.extend({
    contents: z.array(
        z.union([TextResourceContentsSchema, BlobResourceContentsSchema])
    ),
});

export const TextResourceContentsSchema = ResourceContentsSchema.extend({
    /**
     * 항목의 텍스트입니다. 실제로 텍스트(바이너리 데이터가 아님)로 표현 가능한 경우에만 설정해야 합니다.
     */
    text: z.string(),
});
```

:::

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
server.connect(transport);
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
