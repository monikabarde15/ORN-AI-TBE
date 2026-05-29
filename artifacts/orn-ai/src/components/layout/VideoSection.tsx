export function VideoSection() {
  return (
    <section className="bg-[#050018] py-24">
      <div className="container mx-auto px-6">

        <div className="max-w-5xl mx-auto rounded-[32px] overflow-hidden border border-violet-600 shadow-[0_0_80px_rgba(124,58,237,.25)]">

          <iframe
            className="w-full aspect-video"
            src="https://www.youtube.com/embed/6eZ6QYcMc2c?si=YsB--lBaDDs7WpfA"
            allowFullScreen
          />

        </div>

      </div>
    </section>
  );
}