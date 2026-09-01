import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import CodeBlock from "./CodeBlock";

function getCodeString(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(getCodeString).join("");
  if (children && typeof children === "object" && "props" in children) {
    return getCodeString((children as { props: { children: React.ReactNode } }).props.children);
  }
  return "";
}

export default function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={{
        a: ({ href, children }) => {
          const external = href?.startsWith("http");
          const hrefOut = external
            ? href
            : href?.startsWith("#")
              ? href
              : undefined;
          if (external) {
            return (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children} ↗
              </a>
            );
          }
          return <a href={hrefOut}>{children}</a>;
        },
        pre: ({ children }) => {
          const codeEl = Array.isArray(children) ? children[0] : children;
          const props =
            codeEl && typeof codeEl === "object" && "props" in codeEl
              ? (codeEl.props as { children?: React.ReactNode; className?: string })
              : {};
          const lang = props.className?.replace("language-", "");
          return <CodeBlock code={getCodeString(props.children)} lang={lang} />;
        },
        table: ({ children }) => (
          <div className="overflow-x-auto my-6 rounded-xl border border-ink-100 dark:border-ink-800">
            <table className="min-w-full text-sm">{children}</table>
          </div>
        ),
        h2: ({ children, id }) => (
          <h2 id={id} className="scroll-mt-24">
            <a href={`#${id}`} className="no-underline text-inherit">
              {children}
            </a>
          </h2>
        ),
        h3: ({ children, id }) => (
          <h3 id={id} className="scroll-mt-24">
            <a href={`#${id}`} className="no-underline text-inherit">
              {children}
            </a>
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-6 rounded-r-xl border-l-4 border-brand-400 bg-brand-50 dark:bg-brand-900/15 px-4 py-3">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
