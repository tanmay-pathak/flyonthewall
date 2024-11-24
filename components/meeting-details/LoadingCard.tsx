import { Card, CardContent, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const LoadingCard = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-1/4 mb-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
