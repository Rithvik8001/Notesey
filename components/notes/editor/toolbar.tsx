import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Heading3,
  LucideIcon,
} from "lucide-react";
import { Editor } from "@tiptap/react";

interface ToolbarProps {
  editor: Editor | null;
}

interface BaseTool {
  type?: never;
  icon: LucideIcon;
  title: string;
  action: () => boolean;
  isActive: () => boolean;
}

interface ToolDivider {
  type: "divider";
  icon?: never;
  title?: never;
  action?: never;
  isActive?: never;
}

type ToolItem = BaseTool | ToolDivider;

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const tools: ToolItem[] = [
    {
      icon: Bold,
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: Italic,
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: Code,
      title: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive("code"),
    },
    {
      type: "divider",
    },
    {
      icon: Heading1,
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: Heading2,
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Heading3,
      title: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      type: "divider",
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered,
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
  ];

  return (
    <div className="editor-toolbar">
      {tools.map((tool, index) => {
        if (tool.type === "divider") {
          return (
            <div
              key={index}
              className="w-[1px] bg-gray-200 mx-1 h-6 self-center"
            />
          );
        }

        const Icon = tool.icon;
        return (
          <button
            key={tool.title}
            onClick={() => tool.action()}
            className={`${tool.isActive() ? "is-active" : ""}`}
            title={tool.title}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
