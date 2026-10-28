import { ExperienceProvider } from "@/context/ExperienceContext";
import { ExperienceView } from "@/components/ExperienceView";

export default function Home() {
  return (
    <ExperienceProvider>
      <ExperienceView />
    </ExperienceProvider>
  );
}
