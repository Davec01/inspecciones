"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, Send } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  sender: "bot" | "user"
  options?: string[]
}

type FormStep = {
  question: string
  options?: string[]
  nextStep?: (answer: string) => number
}

const formSteps: FormStep[] = [
  {
    question: "¡Hola! ¿Cómo te llamas?",
  },
  {
    question: "Encantado de conocerte, {name}. ¿De qué país eres?",
    options: ["España", "México", "Argentina", "Colombia", "Chile", "Otro"],
  },
  {
    question: "¡Genial! ¿Te gustaría aprender más sobre formularios conversacionales?",
    options: ["Sí, por favor", "No, gracias"],
    nextStep: (answer) => (answer === "Sí, por favor" ? 3 : 4),
  },
  {
    question:
      "Perfecto, vamos a comenzar. Los formularios conversacionales son una forma interactiva de recopilar información que simula una conversación natural.",
  },
  {
    question: "Gracias por completar este formulario de demostración, {name}. ¿Hay algo más en lo que pueda ayudarte?",
    options: ["Sí", "No"],
  },
]

export function ConversationalForm() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [userData, setUserData] = useState<Record<string, string>>({})
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (currentStep === 0) {
      addBotMessage(formSteps[0].question)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addBotMessage = (content: string, options?: string[]) => {
    setIsTyping(true)

    // Replace placeholders with user data
    let processedContent = content
    Object.entries(userData).forEach(([key, value]) => {
      processedContent = processedContent.replace(`{${key}}`, value)
    })

    // Simulate typing delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: processedContent,
          sender: "bot",
          options,
        },
      ])
      setIsTyping(false)
    }, 500)
  }

  const addUserMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content,
        sender: "user",
      },
    ])
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!userInput.trim() && !formSteps[currentStep].options) return

    const answer = userInput.trim() || ""
    addUserMessage(answer)

    // Store user data based on the current step
    if (currentStep === 0) {
      setUserData((prev) => ({ ...prev, name: answer }))
    }

    // Move to the next step
    const nextStep = formSteps[currentStep].nextStep?.(answer) ?? currentStep + 1

    if (nextStep < formSteps.length) {
      setCurrentStep(nextStep)
      setTimeout(() => {
        addBotMessage(formSteps[nextStep].question, formSteps[nextStep].options)
      }, 800)
    }

    setUserInput("")
  }

  const handleOptionClick = (option: string) => {
    setUserInput(option)
    handleSendMessage()
  }

  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden shadow-xl border-0">
      <div className="bg-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-purple-600 text-white">FC</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold text-white">Formulario Conversacional</h2>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="h-[400px] overflow-y-auto p-4 bg-slate-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("mb-4 max-w-[80%] animate-fadeIn", message.sender === "user" ? "ml-auto" : "mr-auto")}
            >
              <div className="flex items-start gap-2">
                {message.sender === "bot" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-purple-600 text-white">FC</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    message.sender === "user"
                      ? "bg-purple-600 text-white rounded-br-none"
                      : "bg-slate-200 text-slate-800 rounded-bl-none",
                  )}
                >
                  {message.content}
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-slate-400">TÚ</AvatarFallback>
                  </Avatar>
                )}
              </div>

              {message.options && message.sender === "bot" && (
                <div className="mt-2 ml-10 flex flex-wrap gap-2">
                  {message.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      size="sm"
                      className="bg-white hover:bg-slate-100"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 mb-4 max-w-[80%]">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-purple-600 text-white">FC</AvatarFallback>
              </Avatar>
              <div className="bg-slate-200 p-3 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                    ●
                  </span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                    ●
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex gap-2 bg-white">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isTyping || (!!formSteps[currentStep].options && messages.length > 0)}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isTyping || (!userInput.trim() && !formSteps[currentStep].options)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
