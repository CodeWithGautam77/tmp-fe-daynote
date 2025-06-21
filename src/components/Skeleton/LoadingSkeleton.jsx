import { Skeleton } from "@mui/material";

export default function LoadingSkeleton(props) {
  const { row, columns, width, height, margin } = props;
  return (
    <div className="w-100">
      {Array.from({ length: row }, (_, index) => index).map((element, i) => {
        return (
          <div key={i} className="flex gap-05">
            {Array.from({ length: columns }, (_, index) => index).map(
              (item, j) => {
                return (
                  <Skeleton
                    key={j}
                    variant="rounded"
                    width={width}
                    height={height}
                    style={{ margin: margin }}
                  />
                );
              }
            )}
          </div>
        );
      })}
    </div>
  );
}
