"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  X,
  Send,
  ExternalLink,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  MessageSquare,
} from "lucide-react";

interface Citation {
  article_id: string;
  title: string;
  url: string;
  snippet: string;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  citations?: Citation[];
}

export function BlogRagChatWidget() {
  const MAX_QUESTIONS_PER_SESSION = 10;
  const [userQuestionCount, setUserQuestionCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");

  // Dictée vocale STT
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Bonjour. Je suis l'assistant RAG de Loïc. Posez-moi une question sur ses articles et publications.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const [modelProvider, setModelProvider] = useState<"google" | "local">(
    "google",
  );

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  // Récupération dynamique du modèle/provider actif
  useEffect(() => {
    if (isOpen) {
      fetch("/api/rag-chat")
        .then((res) => res.json())
        .then((data) => {
          if (
            data?.generation_provider === "local" ||
            data?.generation_provider === "google"
          ) {
            setModelProvider(data.generation_provider);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // Restauration de la session et du quota depuis localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedQuota = localStorage.getItem("rag_chat_quota");
        if (savedQuota) {
          const { count, date } = JSON.parse(savedQuota);
          const isToday =
            new Date(date).toDateString() === new Date().toDateString();
          if (isToday) {
            setUserQuestionCount(count);
          } else {
            localStorage.removeItem("rag_chat_quota");
          }
        }
      } catch (err) {
        console.error("Erreur lecture localStorage quota", err);
      }
    }
  }, []);

  const updateQuota = (count: number) => {
    setUserQuestionCount(count);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "rag_chat_quota",
          JSON.stringify({
            count,
            date: new Date().toISOString(),
          }),
        );
      } catch (err) {
        console.error("Erreur écriture localStorage quota", err);
      }
    }
  };

  // Initialisation Web Speech API (Dictée Vocale STT)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "fr-FR";
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuestion(transcript);
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "La dictée vocale n'est pas supportée par votre navigateur (essayez Chrome ou Edge).",
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Synthèse vocale TTS (Toggle Lecture / Arrêt)
  const toggleSpeakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "fr-FR";
        utterance.rate = 1.05;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    if (userQuestionCount >= MAX_QUESTIONS_PER_SESSION) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "bot",
          text: "Limite de 10 questions par session atteinte pour cette démonstration.",
        },
      ]);
      setQuestion("");
      return;
    }

    const newCount = userQuestionCount + 1;
    updateQuota(newCount);

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: question.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/rag-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMsg.text, top_k: 3 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de réponse");

      if (data.provider === "local" || data.provider === "google") {
        setModelProvider(data.provider);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.answer,
        citations: data.citations,
      };

      setMessages((prev) => [...prev, botMsg]);
      // Note: La lecture vocale automatique par défaut a été désactivée.
      // L'utilisateur peut toujours cliquer sur l'icône de haut-parleur pour réécouter.
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `Erreur: ${err.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 150,
        fontFamily: "var(--font-sans)",
      }}
    >
      {!isOpen ? (
        /* Lanceur Rectangulaire - Sobriété Éditoriale & Carrée */
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir l'assistant RAG"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: 4,
            padding: "10px 16px",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            transition: "all 150ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-teal)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 28,
              height: 28,
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: 3,
              color: "var(--color-teal)",
            }}
          >
            <MessageSquare size={15} />
          </div>

          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Assistant RAG
              </span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  display: "inline-block",
                }}
              />
            </div>
            <p
              style={{
                fontSize: "11px",
                color: "var(--color-text-muted)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Recherche sur mes articles
            </p>
          </div>
        </button>
      ) : (
        /* Fenêtre de Chat Rectangulaire, Carrée & Éditoriale */
        <div
          style={{
            width: 420,
            maxWidth: "calc(100vw - 32px)",
            height: 560,
            maxHeight: "calc(100vh - 48px)",
            backgroundColor: "var(--color-bg)",
            color: "var(--color-text)",
            border: "1px solid var(--color-border)",
            borderRadius: 4,
            boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header Sobbre & Professionnel */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              backgroundColor: "var(--color-surface)",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 3,
                  backgroundColor: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-teal)",
                }}
              >
                <Bot size={16} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h3
                    style={{
                      fontSize: "var(--text-sm)",
                      fontWeight: 600,
                      color: "var(--color-text)",
                      margin: 0,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Assistant RAG
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: 2,
                      backgroundColor: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    {modelProvider === "local" ? "llm local" : "gemini flash"}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                    margin: 0,
                  }}
                >
                  {userQuestionCount}/{MAX_QUESTIONS_PER_SESSION} requêtes
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                padding: 4,
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                transition: "color 150ms",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-muted)")
              }
              aria-label="Fermer la fenêtre de chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Zone des Messages Structurée & Éditoriale */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                }}
              >
                {/* Libellé expéditeur */}
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--color-text-muted)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {msg.sender === "user" ? "Vous" : "Assistant RAG"}
                </span>

                {/* Bulle de Message Rectangulaire */}
                <div
                  style={{
                    maxWidth: "90%",
                    backgroundColor: "var(--color-surface)",
                    border:
                      msg.sender === "user"
                        ? "1px solid var(--color-teal)"
                        : "1px solid var(--color-border)",
                    borderRadius: 4,
                    padding: "12px 14px",
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.6,
                    color: "var(--color-text)",
                  }}
                >
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                    {msg.text}
                  </p>

                  {/* Bouton Synthèse Vocale (Play / Stop) */}
                  {msg.sender === "bot" && msg.id !== "welcome" && (
                    <button
                      onClick={() => toggleSpeakText(msg.text)}
                      style={{
                        marginTop: 10,
                        background: "transparent",
                        border: "none",
                        color: isSpeaking
                          ? "var(--color-teal)"
                          : "var(--color-text-muted)",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: 0,
                        transition: "color 150ms",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "var(--color-teal)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = isSpeaking
                          ? "var(--color-teal)"
                          : "var(--color-text-muted)")
                      }
                    >
                      <Volume2
                        size={13}
                        style={{
                          color: isSpeaking ? "var(--color-teal)" : "inherit",
                        }}
                      />
                      <span>
                        {isSpeaking
                          ? "Arrêter la lecture"
                          : "Écouter la réponse"}
                      </span>
                    </button>
                  )}

                  {/* Cartes des Articles Cités (Style GitHub Repo Card) */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 10,
                        borderTop: "1px solid var(--color-border)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          color: "var(--color-text-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: 8,
                        }}
                      >
                        📖 Article(s) de référence :
                      </p>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        {msg.citations.map((c, i) => (
                          <Link
                            key={i}
                            href={c.url || `/article/${c.article_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              backgroundColor: "var(--color-bg)",
                              border: "1px solid var(--color-border)",
                              borderRadius: 4,
                              padding: "8px 12px",
                              fontSize: "var(--text-xs)",
                              fontFamily: "var(--font-sans)",
                              color: "var(--color-text)",
                              textDecoration: "none",
                              transition: "all 150ms ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-teal)";
                              e.currentTarget.style.backgroundColor =
                                "var(--color-surface)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--color-border)";
                              e.currentTarget.style.backgroundColor =
                                "var(--color-bg)";
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 550,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                paddingRight: 8,
                              }}
                            >
                              {c.title}
                            </span>
                            <ExternalLink
                              size={13}
                              style={{
                                color: "var(--color-teal)",
                                flexShrink: 0,
                              }}
                            />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Skeleton Loading */}
            {isLoading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--color-text-muted)",
                    marginBottom: 4,
                  }}
                >
                  Assistant RAG
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    padding: "10px 14px",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <Loader2
                    size={14}
                    style={{
                      animation: "spin 1s linear infinite",
                      color: "var(--color-teal)",
                    }}
                  />
                  <span>Recherche sémantique et réponse en cours...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulaire d'Envoi Rectangulaire & Professionnel */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "12px 16px",
              backgroundColor: "var(--color-surface)",
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={toggleListening}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 4,
                border: isListening
                  ? "1px solid #ef4444"
                  : "1px solid var(--color-border)",
                backgroundColor: isListening
                  ? "rgba(239, 68, 68, 0.1)"
                  : "var(--color-bg)",
                color: isListening ? "#ef4444" : "var(--color-text-muted)",
                cursor: "pointer",
                flexShrink: 0,
                transition: "all 150ms ease",
              }}
              title={isListening ? "Arrêter la dictée" : "Dictée vocale STT"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={
                isListening
                  ? "Écoute vocale..."
                  : "Posez une question sur les articles..."
              }
              style={{
                flex: 1,
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)",
                border: "1px solid var(--color-border)",
                borderRadius: 4,
                padding: "8px 12px",
                fontSize: "var(--text-sm)",
                fontFamily: "var(--font-sans)",
                outline: "none",
                transition: "border-color 150ms",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-teal)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-border)")
              }
            />

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 4,
                backgroundColor: "var(--color-teal)",
                color: "#ffffff",
                border: "none",
                cursor:
                  isLoading || !question.trim() ? "not-allowed" : "pointer",
                opacity: isLoading || !question.trim() ? 0.4 : 1,
                flexShrink: 0,
                transition: "opacity 150ms ease",
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
