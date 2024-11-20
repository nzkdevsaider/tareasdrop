const page = ({
  params: { taskId },
}: {
  params: {
    taskId: string;
  };
}) => {
  return <div>{taskId}</div>;
};

export default page;
