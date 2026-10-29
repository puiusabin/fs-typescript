import type { CoursePart } from "../types";

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h4>
            {part.name} {part.exerciseCount}
          </h4>{" "}
          <i>{part.description}</i>
        </div>
      );
    case "group":
      return (
        <div>
          <h4>
            {part.name} {part.exerciseCount}
          </h4>{" "}
          <p>project exercises {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h4>
            {part.name} {part.exerciseCount}
          </h4>{" "}
          <i>{part.description}</i>
        </div>
      );
    case "special":
      return (
        <div>
          <h4>
            {part.name} {part.exerciseCount}
          </h4>{" "}
          <i>{part.description}</i>
          <p>required skills: {part.requirements}</p>
        </div>
      );

    default:
      return assertNever(part);
  }
};

export default Part;
