import { useState, useEffect } from "react";
import { useAdminProfiles } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, RefreshCw, User, ShieldCheck, Truck, CheckCircle, XCircle } from "lucide-react";

interface AgentRequest {
  id: string;
  user_id: string;
  role: string;
  is_approved: boolean;
  created_at: string;
  profile?: { full_name: string | null; email: string | null; phone: string | null };
}

export default function AdminUsers() {
  const { profiles, loading, refetch } = useAdminProfiles();
  const [search, setSearch] = useState("");
  const [agentRequests, setAgentRequests] = useState<AgentRequest[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [tab, setTab] = useState<"users" | "agents">("users");
  const { toast } = useToast();

  useEffect(() => {
    fetchAgentRequests();
  }, []);

  const fetchAgentRequests = async () => {
    setLoadingAgents(true);
    const { data: roles } = await supabase
      .from('user_roles')
      .select('*')
      .eq('role', 'agent')
      .order('created_at', { ascending: false });

    if (roles) {
      const userIds = roles.map(r => r.user_id);
      const { data: profs } = await supabase.from('profiles').select('user_id, full_name, email, phone').in('user_id', userIds);
      const merged = roles.map(r => ({
        ...r,
        profile: profs?.find(p => p.user_id === r.user_id) || null,
      }));
      setAgentRequests(merged as any);
    }
    setLoadingAgents(false);
  };

  const handleApprove = async (roleId: string) => {
    const { error } = await supabase.from('user_roles').update({ is_approved: true }).eq('id', roleId);
    if (error) {
      toast({ title: "ব্যর্থ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "এজেন্ট অ্যাপ্রুভ হয়েছে ✅" });
      fetchAgentRequests();
    }
  };

  const handleReject = async (roleId: string) => {
    const { error } = await supabase.from('user_roles').delete().eq('id', roleId);
    if (error) {
      toast({ title: "ব্যর্থ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "এজেন্ট রিজেক্ট হয়েছে" });
      fetchAgentRequests();
    }
  };

  const filtered = profiles.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (p.full_name || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.phone || '').toLowerCase().includes(q) ||
      (p.city || '').toLowerCase().includes(q)
    );
  });

  const pendingAgents = agentRequests.filter(a => !a.is_approved);
  const approvedAgents = agentRequests.filter(a => a.is_approved);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-display">ইউজার ও এজেন্ট</h1>
        <Button variant="outline" size="sm" onClick={() => { refetch(); fetchAgentRequests(); }}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-muted rounded-xl p-1 mb-6 max-w-xs">
        <button onClick={() => setTab("users")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === "users" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
          <User className="h-4 w-4 inline mr-1" />ইউজার
        </button>
        <button onClick={() => setTab("agents")} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all relative ${tab === "agents" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
          <Truck className="h-4 w-4 inline mr-1" />এজেন্ট
          {pendingAgents.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">{pendingAgents.length}</span>
          )}
        </button>
      </div>

      {tab === "users" ? (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p => (
                <div key={p.id} className="bg-card rounded-2xl border border-border/50 p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{p.full_name || 'Unnamed User'}</p>
                      <p className="text-xs text-muted-foreground">{p.email || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span>{p.phone || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">City</span><span>{p.city || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span>{p.country || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>{new Date(p.created_at).toLocaleDateString()}</span></div>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">No users found</div>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {pendingAgents.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                অনুমোদনের অপেক্ষায় ({pendingAgents.length})
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {pendingAgents.map(a => (
                  <div key={a.id} className="bg-card rounded-2xl border-2 border-yellow-500/30 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{a.profile?.full_name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{a.profile?.email || '-'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">ফোন: {a.profile?.phone || '-'}</p>
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(a.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />অ্যাপ্রুভ
                      </Button>
                      <Button size="sm" variant="destructive" className="flex-1" onClick={() => handleReject(a.id)}>
                        <XCircle className="h-4 w-4 mr-1" />রিজেক্ট
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-lg font-bold mb-3">অ্যাপ্রুভড এজেন্ট ({approvedAgents.length})</h2>
          {loadingAgents ? (
            <div className="flex justify-center py-12"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>
          ) : approvedAgents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedAgents.map(a => (
                <div key={a.id} className="bg-card rounded-2xl border border-border/50 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{a.profile?.full_name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{a.profile?.email || '-'}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">ফোন: {a.profile?.phone || '-'}</p>
                  <p className="text-xs text-muted-foreground mt-1">যোগদান: {new Date(a.created_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border/50 p-8 text-center text-muted-foreground">
              কোনো এজেন্ট নেই
            </div>
          )}
        </>
      )}
    </div>
  );
}
