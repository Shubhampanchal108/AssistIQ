type SourceType = "website" | "docs" | "uploads" | "text" 
type SourceStatus = "active" | "tranning" | "error" | "excluded"

type SectionStatus = "active" | "draft" | "disabled";
type Tone = "strict" | "neutral" | "Friendly" | "empathetic";

interface  SectionFormData{
  name: string
  description: string
  tone: Tone
  allowedTopics: string
  blockedTopics: string
  fallbackBehavior: string
}

interface KnowledgeSource {
    id: string
    _id?: string
    user_email?: string
    type: string
    name: string
    status: string
    source_url: string | null
    content: string | null
    meta_data: string | null
    last_updated: string | null
    created_at: string | null
    updatedAt?: string
    createdAt?: string
}

interface Section{
  id: string
  name: string
  description?: string
  sourceCount: number
  source_ids?: string[]
  tone: Tone
  scopeLabel: string
  allowed_topics?: string,
  blocked_topics?: string
  status: SectionStatus
}

type ConversationStatus = "active" | "resolved" | "escalated" | "pending";
type Sentiment = "positive" | "neutral" | "negative";

interface ChatMessage {
  id?: string;
  _id?: string;
  role: "user" | "assistant" | "agent";
  content: string;
  timestamp: string | Date;
}

interface Conversation {
  id: string;
  _id?: string;
  user_email: string;
  customer_name: string;
  customer_email: string;
  customer_avatar?: string;
  status: ConversationStatus;
  section_name?: string;
  sentiment?: Sentiment;
  summary?: string;
  rating?: number;
  last_message: string;
  last_message_at: string | Date;
  messages: ChatMessage[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}