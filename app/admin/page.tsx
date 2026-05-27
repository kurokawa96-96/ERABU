// handleSelectElectionは依存配列を正しく設定
const handleSelectElection = useCallback((election: Election) => {
  setEditElection(election);
  setSelectedElectionId(election.id);
  setEditCandidate(null);
  fetchCandidates(election.id);
}, [fetchCandidates]); // 状態更新関数は依存に含めない

// handleCreateElectionは依存配列を正しく設定
const handleCreateElection = useCallback(() => {
  const newElection: Election = { 
    id: "", 
    prefecture: "", 
    electionDate: "", 
    candidates: [] 
  };
  setEditElection(newElection);
  setEditCandidate(null);
  setSelectedElectionId(null);
}, []); // 外部依存なし
