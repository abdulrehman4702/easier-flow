import type React from "react"
import { Edit, FileJson, Upload, Code, Workflow, Zap, Shield, Repeat } from "lucide-react"

export function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 mt-4 md:text-xl dark:text-gray-400">
            Everything you need to build complex workflows with ease
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Workflow className="h-10 w-10 text-primary" />}
            title="Drag-and-Drop Workflow Canvas"
            description="Build complex workflows with our intuitive node-based design system. Connect apps, APIs, and data transformers with ease."
          />
          <FeatureCard
            icon={<Edit className="h-10 w-10 text-primary" />}
            title="Editable Node Names"
            description="Rename nodes for better clarity and organization of your workflow components."
          />
          <FeatureCard
            icon={<Upload className="h-10 w-10 text-primary" />}
            title="YAML Upload with Swagger Integration"
            description="Upload YAML files to automatically extract Swagger-defined endpoints and URLs."
          />
          <FeatureCard
            icon={<FileJson className="h-10 w-10 text-primary" />}
            title="Schema Response Editing"
            description="Edit schema responses in JSON format directly within the platform."
          />
          <FeatureCard
            icon={<Code className="h-10 w-10 text-primary" />}
            title="Request Body Configuration"
            description="Define request bodies for POST, PUT, and DELETE methods with a user-friendly interface."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-primary" />}
            title="Powerful API Integration"
            description="Connect to any API with predefined endpoints or add your own custom integrations with full authentication support."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Secure Authentication"
            description="Support for OAuth, API Keys, and other authentication methods to securely connect to your services."
          />
          <FeatureCard
            icon={<Repeat className="h-10 w-10 text-primary" />}
            title="Data Transformation"
            description="Transform and map data between steps with our powerful data mapper and transformer tools."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}

