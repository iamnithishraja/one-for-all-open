import { NotionAPI } from "notion-client";
import { getProblemById } from "../../../actions/problem";
import { BlogAppbar } from "../../../components/app-bar/BlogAppBar";
import { ProblemWithRelations, TracksType } from "../../../types/userTypes";
import { ProblemType } from "@repo/db/client";
import BlogRender from "../../../components/renderers/BlogRender";
import CodeRenderer from "../../../components/renderers/CodeRenderer";
import McqRenderer from "../../../components/renderers/McqRenderer";
import { getTrackById } from "../../../actions/track";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import FloatingButtons from "../../../components/FlotingButtons";

const notion = new NotionAPI();

export default async function Problem({
  params,
}: {
  params: { trackId: string[] };
}) {
  const problem = (await getProblemById(
    params.trackId[1]
  )) as ProblemWithRelations | null;
  const track = (await getTrackById(params.trackId[0])) as TracksType;
  const session = await getServerSession(authOptions);

  let notionRecordMap;
  try {
    notionRecordMap = await notion.getPage(problem!.notionDocId);
  } catch (err: any) {
    notionRecordMap = await notion.getPage(
      "MCQ-Question-c8d30db572414bd68a6dfaa6b33caf6b"
    );
  }

  return (
    <div className="relative">
      {problem == null ? (
        <div></div>
      ) : (
        <div>
          <div>
            <BlogAppbar
              problem={problem as ProblemWithRelations}
              track={track}
            />
          </div>
          <div>
            {problem.problemType == ProblemType.Blog ? (
              <BlogRender recordMap={notionRecordMap} />
            ) : problem.problemType == ProblemType.Code ? (
              <CodeRenderer problem={problem} recordMap={notionRecordMap} />
            ) : (
              <McqRenderer recordMap={notionRecordMap} problem={problem} />
            )}
          </div>
          {session.user?.id === track.autherId && <FloatingButtons problem={problem}/>}
        </div>
      )}
    </div>
  );
}
