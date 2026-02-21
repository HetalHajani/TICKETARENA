import { useEffect, useState } from "react";
import {  User,  Mail,  Phone,  Calendar,  Ticket,  CheckCircle2,  XCircle,  Camera,} from "lucide-react";
import { ApiService } from "../../Services/ApiService.js";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const authData = JSON.parse(
    localStorage.getItem("authDetail-tickethub") || "{}",
  );
  const id = authData.id;

  const getUserProfile = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get(`/users/${id}`);
      setUser(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        memberSince: response.data.createdAt?.split("T")[0] || "",
        phone: response.data.phone,
        bio: response.data.bio || "Premier Member of the Arena",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getUserProfile();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <div className="h-screen bg-slate-50 flex items-center justify-center font-bold text-emerald-600">
        LOADING...
      </div>
    );

  return (
   <div className="relative min-h-screen bg-[url('/Stadium.png')] bg-cover bg-center bg-fixed flex items-center justify-center">
      {/* DARK OVERLAY */}
      <div className=" absolute inset-0 bg-black/65 "/>
      <div className="relative z-10 p-10 md:p-12 flex items-center justify-center">

      {/* CARD CONTAINER */}
      <div className="max-w-5xl w-full min-h-[380px] bg-white/10 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border border-slate-200 mx-4 md:mx-6">

        {/* LEFT SIDEBAR */}
        <div className="w-full md:w-[320px] bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#334155] p-10 text-white flex flex-col items-center shrink-0 border-r border-white/10">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-500 to-emerald-300 p-[2px] rotate-3 shadow-lg">
              <div className="w-full h-full bg-slate-900 rounded-[1.4rem] flex items-center justify-center text-4xl font-black italic">
                {user.name?.charAt(0)}
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 p-2 bg-emerald-500 rounded-xl border-4 border-[#0F172A] hover:scale-110 transition-transform">
              <Camera size={14} />
            </button>
          </div>

          <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2 text-center">
            {user.name}
          </h3>
          <div className="flex items-center gap-1 text-emerald-400 font-bold text-[10px] uppercase tracking-widest mb-12">
            <CheckCircle2 size={12} /> Verified Member
          </div>

          {/* STATS AREA */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <Ticket size={16} className="text-emerald-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Booked
                </span>
              </div>
              <span className="text-lg font-black italic">
                {user.totalBookings || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex items-center gap-3">
                <XCircle size={16} className="text-rose-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Cancelled
                </span>
              </div>
              <span className="text-lg font-black italic">
                {user.cancelledBookings || 0}
              </span>
            </div>
          </div>

          <div className="mt-auto pt-10 text-slate-200 text-[9px] font-black uppercase tracking-[0.4em] opacity-40">
            USER ID: {id}
          </div>
        </div>

        {/* RIGHT CONTENT - */}
        <div className="flex-1 p-10 md:p-14 bg-black/30 flex flex-col gap-1">
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-slate-100">
            <div>
              <h1 className="text-4xl font-[1000] italic uppercase tracking-tighter text-white leading-none">
                PAVILION
              </h1>
              <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mt-2">
                Member Credentials
              </p>
            </div>
  <button
  onClick={() => setIsEditing(!isEditing)}
  className={`
    mt-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-emerald-500 text-white border-2 border-emerald-400 hover:bg-emerald-600 hover:border-emerald-300 
    hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95 transition-all duration-200
  `}
>
  {isEditing ? "Discard Changes" : "Edit Profile"}
</button>
          </div>

          {/* INPUT FIELDS */}
          <div className="space-y-6 flex-1">
            <div className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-2 block">
              <AlignmentRow
                label="Full Name"
                name="name"
                value={formData.name}
                icon={<User size={16} />}
                isEditing={isEditing}
                onChange={handleChange}
              />{" "}
            </div>
            <AlignmentRow
              label="Email Address"
              name="email"
              value={formData.email}
              icon={<Mail size={16} />}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <AlignmentRow
              label="Mobile Number"
              name="phone"
              value={formData.phone}
              icon={<Phone size={16} />}
              isEditing={isEditing}
              onChange={handleChange}
            />
            <AlignmentRow
              label="Member Since"
              name="memberSince"
              value={formData.memberSince}
              icon={<Calendar size={16} />}
              isEditing={false}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

// AlignmentRow Component (unchanged)
const AlignmentRow = ({ label, name, value, icon, isEditing, onChange }) => (
  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-10 group mb-4">
    {/* Changed to black / dark gray */}
    <label className="w-full md:w-40 text-[15px] font-black text-gray-300 uppercase tracking-widest shrink-0 mb-1 md:mb-0">
      {label}
    </label>

    <div
      className={`flex-1 flex items-center gap-2 px-5 py-3 rounded-xl border-2 transition-all ${
        isEditing
          ? "bg-white/90 border-emerald-500 shadow-lg shadow-emerald-500/20"
          : "bg-slate-800/30 border-slate-600/50 backdrop-blur-sm"
      }`}
    >
      <span
        className={`text-emerald-400 transition-colors ${!isEditing && "opacity-60"}`}
      >
        {icon}
      </span>
      <input
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={!isEditing}
        className="bg-transparent w-full text-sm font-bold outline-none text-slate-900 disabled:text-slate-500 placeholder:text-slate-500"
      />
    </div>
  </div>
);

export default Profile;
