import { server } from '@/config';
import HistoryLogs from '@/layouts/HistoryLogs';
import { getUser, withPageAuth } from '@supabase/auth-helpers-nextjs';
import { HistoryRecord } from '../../types/github';

interface Props {
  items: HistoryRecord[];
}

const History: React.FC<Props> = ({ items }) => {
  return (
    <HistoryLogs
      items={items}
      renderDescription={(item: HistoryRecord) => {
        return (
          <p className="p-1">
            Deleted repository at{` `}
            {new Date(item.created_at as string).toLocaleString()}
          </p>
        );
      }}
    />
  );
};

export default History;

export const getServerSideProps = withPageAuth({
  redirectTo: `/`,
  async getServerSideProps(ctx) {
    const { user } = await getUser(ctx);
    const dbResponse = await fetch(
      `${server}/api/history/deleted?userId=${user.id}`,
    );
    const items = await dbResponse.json();

    return { props: { user, items } };
  },
});
