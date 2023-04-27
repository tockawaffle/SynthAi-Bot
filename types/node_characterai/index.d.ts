/**
 * @notice This is the custom-made type definitions for the node_characterai package. Feel free to use it in your own projects, it might not work-as-intended though.
 * @notice This typing is really raw in it's content, it has so many "any" types, but it "works" until I have enough time to make it better and test each and every function for it's return type.
 */

declare module "node_characterai" {
    export class Chat {
        constructor(client: Client, characterId: string, body: any);
        async fetchMessages(): Promise<any>;
        async sendMessage(message: string): Promise<any>;
        async continue(): Promise<any>;
    }

    export class Client {
        constructor();
        requester: Requester;
        fetchCategories(): Promise<any>;
        fetchUserConfig(): Promise<any>;
        fetchUser(): Promise<any>;
        fetchFeaturedCharacters(): Promise<any>;
        fetchCharactersByCategory(curated?: boolean): Promise<any>;
        fetchCharacterInfo(characterId: string): Promise<any>;
        searchCharacters(characterName: string): Promise<any>;
        getRecentConversations(): Promise<any>;
        createOrContinueChat(
            characterId: string,
            externalId?: string
        ): Promise<Chat>;
        authenticateWithToken(token: string): Promise<string>;
        authenticateAsGuest(): Promise<string>;
        unauthenticate(): void;
        getToken(): string | undefined;
        isGuest(): boolean;
        isAuthenticated(): boolean;
        getHeaders(): any;
    }

    export class Parser {
        static parseJSON(response: any): any;
        static stringify(text: any): string;
    }

    export class Requester {
        browser: any;
        page: any;
        #initialized: boolean;
        #hasDisplayed: boolean;
        #headless: boolean;
        constructor();
        isInitialized(): boolean;
        initialize(): Promise<void>;
        request(url: string, options?: any): Promise<any>;
    }

    declare class Chat {
        constructor(client: any, characterId: string, continueBody: any);
        characterId: string;
        externalId: string;
        aiId: string;
        requester: any;
        fetchHistory(pageNumber?: number): Promise<MessageHistory>;
        sendAndAwaitResponse(
            optionsOrMessage: any,
            singleReply?: boolean
        ): Promise<Array<Message> | Message>;
        changeToConversationId(
            conversationExternalId: string,
            force?: boolean
        ): Promise<void>;
        getSavedConversations(amount?: number): Promise<any>;
        getMessageById(messageId: string): Promise<Message | null>;
        deleteMessage(messageId: string): Promise<void>;
        deleteMessages(messageIds: Array<string>): Promise<void>;
        deleteMessagesBulk(
            amount?: number,
            descending?: boolean
        ): Promise<void>;
        saveAndStartNewChat(): Promise<any>;
    }

    declare class OutgoingMessage {
        constructor(chat: Chat, options: any);
    }

    declare class Message {
        constructor(chat: Chat, options: any);
        chat: Chat;
        rawOptions: any;
        id: string;
        text: string;
        src: string;
        tgt: string;
        isAlternative: boolean;
        imageRelativePath: string;
        imagePromptText: string;
        deleted: boolean | null;
        srcName: string;
        srcInternalId: string;
        srcIsHuman: boolean;
        srcCharacterAvatarFileName: string;
        srcCharacterDict: any;
        responsibleUserName: string;
        getPreviousMessage(): Promise<Message | null>;
        delete(deletePreviousToo?: boolean): Promise<void>;
        getAvatarLink(): string;
        returnMessage(): string;
    }

    declare class Reply {
        constructor(chat: Chat, options: any);
        chat: Chat;
        text: string;
        id: string;
        srcCharacterName: string;
        srcAvatarFileName: string;
        isFinalChunk: boolean;
        lastUserMessageId: string;
        getMessage(): Promise<Message | null>;
    }

    declare class MessageHistory {
        constructor(
            chat: Chat,
            messages: Array<Message>,
            hasMore: boolean,
            nextPage: number | null
        );
        chat: Chat;
        messages: Array<Message>;
        hasMore: boolean;
        nextPage: number | null;
    }

    declare class Parser {
        static parseJSON(response: Response): Promise<any>;
        static stringify(text: any): string;
    }

    interface RequestOptions {
        method?: "GET" | "POST";
        body?: Record<string, unknown>;
        headers?: Record<string, string>;
    }

    interface RequesterOptions {
        headless?: boolean;
    }

    interface Response {
        status: () => number;
        text: () => Promise<string>;
        json: () => Promise<Record<string, unknown>>;
    }

    class Requester {
        browser: any;
        page: Page;

        #initialized: boolean;
        #hasDisplayed: boolean;
        #headless: boolean;

        constructor(options?: RequesterOptions);
        isInitialized(): boolean;
        initialize(): Promise<void>;
        request(url: string, options: RequestOptions): Promise<Response>;
    }

    export {
        Chat,
        OutgoingMessage,
        Message,
        Reply,
        MessageHistory,
        Parser,
        Requester,
    };

    export default Client;
}

declare module "./parser" {
    export function parseJSON(request: any): Promise<any>;
    export function stringify(data: any): string;
}
