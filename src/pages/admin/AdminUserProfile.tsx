import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Phone, MapPin, Globe, Calendar, Package, Plane } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileData {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
}

export default function AdminUserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [shipments, setShipments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    const [profileRes, shipmentsRes, bookingsRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', userId!).maybeSingle(),
      supabase.from('shipments').select('id, tracking_id, route, status, created_at, weight, receiver_name').eq('user_id', userId!).order('created_at', { ascending: false }).limit(20),
      supabase.from('flight_bookings').select('id, booking_ref, from_city, to_city, status, departure_date, total_price').eq('user_id', userId!).order('created_at', { ascending: false }).limit(20),
    ]);

    setProfile(profileRes.data as ProfileData | null);
    setShipments(shipmentsRes.data || []);
    setBookings(bookingsRes.data || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">User not found</p>
        <Button variant="outline" onClick={() => navigate("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-2" />Back to Users
        </Button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-600",
    in_transit: "bg-indigo-500/10 text-indigo-600",
    delivered: "bg-green-500/10 text-green-600",
    cancelled: "bg-red-500/10 text-red-600",
    confirmed: "bg-green-500/10 text-green-600",
    completed: "bg-green-600/10 text-green-700",
  };

  return (
    <div>
      <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/admin/users")}>
        <ArrowLeft className="h-4 w-4 mr-2" />Back to Users
      </Button>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border/50 p-6 mb-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold font-display">{profile.full_name || 'Unnamed User'}</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{profile.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{profile.phone || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>{profile.city || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Globe className="h-4 w-4 shrink-0" />
                <span>{profile.country || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="truncate">{profile.address || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{shipments.length}</p>
              <p className="text-sm text-muted-foreground">Shipments</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Plane className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{bookings.length}</p>
              <p className="text-sm text-muted-foreground">Flight Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipments */}
      {shipments.length > 0 && (
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2"><Package className="h-4 w-4" /> Shipments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                  <th className="p-3">Tracking ID</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Receiver</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-medium text-primary">{s.tracking_id}</td>
                    <td className="p-3">{s.route === 'bd-to-ca' ? '🇧🇩→🇨🇦' : '🇨🇦→🇧🇩'}</td>
                    <td className="p-3">{s.receiver_name}</td>
                    <td className="p-3">{s.weight || '-'} kg</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[s.status] || 'bg-muted text-muted-foreground'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings */}
      {bookings.length > 0 && (
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2"><Plane className="h-4 w-4" /> Flight Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-muted-foreground">
                  <th className="p-3">Booking Ref</th>
                  <th className="p-3">Route</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-3 font-medium text-primary">{b.booking_ref}</td>
                    <td className="p-3">{b.from_city} → {b.to_city}</td>
                    <td className="p-3">{new Date(b.departure_date).toLocaleDateString()}</td>
                    <td className="p-3">{b.total_price ? `$${b.total_price}` : '-'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status] || 'bg-muted text-muted-foreground'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {shipments.length === 0 && bookings.length === 0 && (
        <div className="bg-card rounded-xl border border-border/50 p-8 text-center text-muted-foreground">
          No activity found for this user
        </div>
      )}
    </div>
  );
}
