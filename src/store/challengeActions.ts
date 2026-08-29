import { Challenge, ChallengeParticipant, ChallengeMode, ChallengeStatus } from '@/types';
import { generateId } from '@/utils';

function calculateScore(mode: ChallengeMode, workouts: any[], habits: any[], startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  switch (mode) {
    case 'workouts':
      return workouts.filter(w => {
        const d = new Date(w.date).getTime();
        return d >= start && d <= end;
      }).length;

    case 'volume':
      return workouts
        .filter(w => { const d = new Date(w.date).getTime(); return d >= start && d <= end; })
        .reduce((sum, w) => sum + (w.totalVolume || 0), 0);

    case 'streak': {
      // Count consecutive days with at least one workout in the period
      const workoutDays = new Set(
        workouts
          .filter(w => { const d = new Date(w.date).getTime(); return d >= start && d <= end; })
          .map(w => w.date.split('T')[0])
      );
      let streak = 0;
      let current = 0;
      const d = new Date(start);
      while (d.getTime() <= end) {
        const key = d.toISOString().split('T')[0];
        if (workoutDays.has(key)) { current++; streak = Math.max(streak, current); }
        else { current = 0; }
        d.setDate(d.getDate() + 1);
      }
      return streak;
    }

    case 'habitCompletion': {
      let total = 0;
      const d2 = new Date(start);
      while (d2.getTime() <= end) {
        const dateStr = d2.toISOString().split('T')[0];
        const completed = habits.filter(h => h.completedDates.includes(dateStr)).length;
        total += completed;
        d2.setDate(d2.getDate() + 1);
      }
      return total;
    }

    default:
      return 0;
  }
}

function getChallengeStatus(challenge: Challenge): ChallengeStatus {
  const now = Date.now();
  const start = new Date(challenge.startDate).getTime();
  const end = new Date(challenge.endDate).getTime();
  if (now < start) return 'upcoming';
  if (now > end) return 'completed';
  return 'active';
}

const challengeModeLabels: Record<ChallengeMode, string> = {
  workouts: 'Workouts Done',
  volume: 'Total Volume (kg)',
  streak: 'Best Streak (days)',
  habitCompletion: 'Habits Completed',
};

export { challengeModeLabels };

export const challengeActions = (set: any, get: any) => ({
  challenges: [] as Challenge[],

  createChallenge: (challenge: { name: string; mode: ChallengeMode; startDate: string; endDate: string; createdBy: string; description: string }) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: generateId(),
      status: getChallengeStatus({ ...challenge, status: 'active' } as Challenge),
      participants: [{ friendId: 'user', score: 0, joinedAt: new Date().toISOString() }],
    };
    set((state: any) => ({ challenges: [newChallenge, ...state.challenges] }));
  },

  joinChallenge: (challengeId: string) => {
    set((state: any) => ({
      challenges: state.challenges.map((c: Challenge) =>
        c.id === challengeId && !c.participants.find((p: ChallengeParticipant) => p.friendId === 'user')
          ? { ...c, participants: [...c.participants, { friendId: 'user', score: 0, joinedAt: new Date().toISOString() }] }
          : c
      ),
    }));
  },

  leaveChallenge: (challengeId: string) => {
    set((state: any) => ({
      challenges: state.challenges.map((c: Challenge) =>
        c.id === challengeId
          ? { ...c, participants: c.participants.filter((p: ChallengeParticipant) => p.friendId !== 'user') }
          : c
      ),
    }));
  },

  deleteChallenge: (challengeId: string) => {
    set((state: any) => ({
      challenges: state.challenges.filter((c: Challenge) => c.id !== challengeId),
    }));
  },

  updateChallengeScores: () => {
    const { challenges, workouts, habits, friends, profile } = get();
    if (!challenges || challenges.length === 0) return;

    const updated = challenges.map((challenge: Challenge) => {
      const status = getChallengeStatus(challenge);
      const participants = challenge.participants.map((p: ChallengeParticipant) => {
        let score: number;
        if (p.friendId === 'user') {
          score = calculateScore(challenge.mode, workouts, habits, challenge.startDate, challenge.endDate);
        } else {
          // Simulate friend scores based on their totalVolume and rank
          const friend = friends.find((f: any) => f.id === p.friendId);
          if (!friend) return p;
          const friendWorkouts = workouts.slice(0, Math.floor(Math.random() * 5) + 1);
          score = calculateScore(challenge.mode, friendWorkouts, [], challenge.startDate, challenge.endDate);
          // Add some base score from friend's stats
          if (challenge.mode === 'volume') score += Math.floor(friend.totalVolume * 0.05);
          if (challenge.mode === 'workouts') score += Math.floor(friend.totalVolume / 50000);
        }
        return { ...p, score };
      });
      return { ...challenge, status, participants };
    });

    set({ challenges: updated });
  },
});
