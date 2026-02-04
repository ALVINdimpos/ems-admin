interface IAnnouncementContentProps {
  content: string;
}

export function AnnouncementContent({ content }: IAnnouncementContentProps) {
  return (
    <article className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 sm:p-8">
      <div
        className="prose prose-invert prose-lg max-w-none
                    prose-headings:text-white prose-headings:font-bold
                    prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-a:text-sky-400 prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-semibold
                    prose-em:text-slate-200
                    prose-ul:text-slate-300 prose-ol:text-slate-300
                    prose-li:text-slate-300 prose-li:marker:text-sky-400
                    prose-blockquote:text-slate-300 prose-blockquote:border-sky-400
                    prose-code:text-sky-300 prose-code:bg-slate-700/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700
                    prose-img:rounded-xl prose-img:border prose-img:border-slate-700 prose-img:shadow-lg
                    prose-hr:border-slate-700
                    prose-th:text-slate-200 prose-td:text-slate-300
                    [&>*]:text-slate-300"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
