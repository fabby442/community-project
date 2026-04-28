# community-project
<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aura — Social</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1c1c28;
    --surface3: #242434;
    --border: #2a2a3e;
    --accent: #c084fc;
    --accent2: #f0abfc;
    --gold: #fbbf24;
    --text: #f1f0ff;
    --muted: #8b8aa8;
    --danger: #f87171;
    --success: #34d399;
    --gradient: linear-gradient(135deg, #c084fc, #f0abfc, #a78bfa);
    --glow: 0 0 40px rgba(192,132,252,0.15);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { height:100%; background:var(--bg); color:var(--text); font-family:'DM Sans',sans-serif; overflow:hidden; }

/* AUTH */
#auth-screen {
position:fixed; inset:0; background:var(–bg);
display:flex; align-items:center; justify-content:center;
z-index:1000;
background-image: radial-gradient(ellipse 80% 60% at 50% -20%, rgba(192,132,252,0.15), transparent),
radial-gradient(ellipse 60% 40% at 80% 120%, rgba(167,139,250,0.1), transparent);
}
#auth-screen.hidden { display:none; }
.auth-box {
background:var(–surface); border:1px solid var(–border);
border-radius:24px; padding:48px 40px; width:420px; max-width:95vw;
box-shadow: var(–glow), 0 24px 64px rgba(0,0,0,0.5);
}
.auth-logo {
font-family:‘DM Serif Display’,serif; font-size:38px;
background:var(–gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent;
background-clip:text; text-align:center; margin-bottom:6px;
}
.auth-tagline { text-align:center; color:var(–muted); font-size:13px; margin-bottom:32px; letter-spacing:.05em; }
.auth-tabs { display:flex; gap:2px; background:var(–surface2); border-radius:12px; padding:3px; margin-bottom:28px; }
.auth-tab {
flex:1; padding:9px; border-radius:10px; border:none; cursor:pointer;
font-family:‘DM Sans’,sans-serif; font-size:14px; font-weight:500;
background:transparent; color:var(–muted); transition:all .2s;
}
.auth-tab.active { background:var(–surface3); color:var(–text); }
.auth-form { display:flex; flex-direction:column; gap:14px; }
.auth-form.hidden { display:none; }
.field-group { display:flex; flex-direction:column; gap:6px; }
.field-group label { font-size:12px; font-weight:500; color:var(–muted); letter-spacing:.05em; text-transform:uppercase; }
.field-group input {
background:var(–surface2); border:1px solid var(–border); border-radius:10px;
padding:11px 14px; color:var(–text); font-family:‘DM Sans’,sans-serif; font-size:14px;
outline:none; transition:border-color .2s;
}
.field-group input:focus { border-color:var(–accent); }
.btn-primary {
background:var(–gradient); border:none; border-radius:10px;
padding:12px; color:#fff; font-family:‘DM Sans’,sans-serif; font-size:15px;
font-weight:600; cursor:pointer; transition:opacity .2s, transform .1s;
margin-top:4px;
}
.btn-primary:hover { opacity:.9; }
.btn-primary:active { transform:scale(.98); }
.auth-error { color:var(–danger); font-size:13px; text-align:center; min-height:18px; }

/* MAIN APP */
#app { display:flex; height:100vh; opacity:0; transition:opacity .4s; }
#app.visible { opacity:1; }

/* SIDEBAR */
.sidebar {
width:240px; background:var(–surface); border-right:1px solid var(–border);
display:flex; flex-direction:column; padding:20px 0; flex-shrink:0;
background-image: radial-gradient(ellipse 100% 40% at 50% 0%, rgba(192,132,252,0.06), transparent);
}
.sidebar-logo {
font-family:‘DM Serif Display’,serif; font-size:26px; padding:8px 24px 24px;
background:var(–gradient); -webkit-background-clip:text; -webkit-text-fill-color:transparent;
background-clip:text;
}
.nav-item {
display:flex; align-items:center; gap:12px; padding:11px 24px;
cursor:pointer; color:var(–muted); font-size:14px; font-weight:500;
border-left:2px solid transparent; transition:all .2s;
}
.nav-item:hover { color:var(–text); background:rgba(192,132,252,0.05); }
.nav-item.active { color:var(–accent); border-left-color:var(–accent); background:rgba(192,132,252,0.08); }
.nav-item .icon { font-size:18px; width:22px; text-align:center; }
.nav-bottom { margin-top:auto; padding:16px 24px; border-top:1px solid var(–border); }
.user-chip {
display:flex; align-items:center; gap:10px; cursor:pointer;
padding:8px 10px; border-radius:12px; transition:background .2s;
}
.user-chip:hover { background:var(–surface2); }
.avatar {
width:36px; height:36px; border-radius:50%; object-fit:cover;
background:var(–gradient); display:flex; align-items:center; justify-content:center;
color:#fff; font-weight:700; font-size:14px; flex-shrink:0; overflow:hidden;
}
.avatar.sm { width:28px; height:28px; font-size:11px; }
.avatar.lg { width:52px; height:52px; font-size:20px; }
.avatar.xl { width:80px; height:80px; font-size:28px; }
.user-info .name { font-size:13px; font-weight:600; color:var(–text); }
.user-info .handle { font-size:11px; color:var(–muted); }
.logout-btn { background:none; border:none; color:var(–muted); font-size:16px; cursor:pointer; padding:4px; margin-left:auto; transition:color .2s; }
.logout-btn:hover { color:var(–danger); }

/* MAIN CONTENT */
.main { flex:1; display:flex; flex-direction:column; overflow:hidden; }

/* PAGES */
.page { display:none; flex:1; overflow-y:auto; }
.page.active { display:flex; flex-direction:column; }
.page::-webkit-scrollbar { width:4px; }
.page::-webkit-scrollbar-track { background:transparent; }
.page::-webkit-scrollbar-thumb { background:var(–border); border-radius:2px; }

/* FEED PAGE */
.feed-layout { display:flex; gap:0; height:100%; }
.feed-center { flex:1; max-width:600px; padding:24px 24px; overflow-y:auto; }
.feed-center::-webkit-scrollbar { width:4px; }
.feed-center::-webkit-scrollbar-thumb { background:var(–border); border-radius:2px; }
.feed-right { width:280px; padding:24px 20px; overflow-y:auto; flex-shrink:0; }

/* STORIES */
.stories-row {
display:flex; gap:12px; margin-bottom:24px; overflow-x:auto; padding-bottom:4px;
}
.stories-row::-webkit-scrollbar { height:0; }
.story-bubble { display:flex; flex-direction:column; align-items:center; gap:6px; cursor:pointer; flex-shrink:0; }
.story-ring {
width:62px; height:62px; border-radius:50%; padding:2.5px;
background:var(–gradient);
transition:transform .2s;
}
.story-ring:hover { transform:scale(1.05); }
.story-ring.seen { background:var(–surface3); }
.story-inner {
width:100%; height:100%; border-radius:50%; background:var(–surface2);
border:2px solid var(–bg); overflow:hidden;
display:flex; align-items:center; justify-content:center;
font-weight:700; font-size:18px; color:#fff;
}
.story-add-btn {
width:62px; height:62px; border-radius:50%;
background:var(–surface2); border:2px dashed var(–border);
display:flex; align-items:center; justify-content:center;
font-size:24px; color:var(–accent); cursor:pointer; flex-shrink:0;
transition:all .2s;
}
.story-add-btn:hover { border-color:var(–accent); background:rgba(192,132,252,0.08); }
.story-label { font-size:11px; color:var(–muted); white-space:nowrap; max-width:64px; overflow:hidden; text-overflow:ellipsis; text-align:center; }

/* CREATE POST */
.create-post {
background:var(–surface); border:1px solid var(–border); border-radius:16px;
padding:16px; margin-bottom:20px;
}
.create-post-top { display:flex; gap:12px; align-items:flex-start; }
.create-post-input {
flex:1; background:var(–surface2); border:1px solid var(–border); border-radius:12px;
padding:12px 14px; color:var(–text); font-family:‘DM Sans’,sans-serif; font-size:14px;
resize:none; outline:none; min-height:48px; transition:border-color .2s, min-height .2s;
}
.create-post-input:focus { border-color:var(–accent); min-height:80px; }
.create-post-actions { display:flex; gap:8px; margin-top:12px; margin-left:48px; align-items:center; }
.icon-btn {
background:none; border:1px solid var(–border); border-radius:8px;
padding:7px 12px; color:var(–muted); font-size:13px; cursor:pointer;
display:flex; align-items:center; gap:6px; transition:all .2s;
font-family:‘DM Sans’,sans-serif;
}
.icon-btn:hover { border-color:var(–accent); color:var(–accent); }
.post-btn { margin-left:auto; padding:8px 20px; font-size:13px; font-weight:600; }

/* POSTS */
.post-card {
background:var(–surface); border:1px solid var(–border); border-radius:16px;
padding:18px; margin-bottom:16px; transition:border-color .2s;
}
.post-card:hover { border-color:var(–surface3); }
.post-header { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
.post-meta { flex:1; }
.post-meta .name { font-size:14px; font-weight:600; }
.post-meta .time { font-size:11px; color:var(–muted); }
.post-content { font-size:14px; line-height:1.6; color:var(–text); margin-bottom:14px; }
.post-image {
width:100%; border-radius:12px; margin-bottom:14px; max-height:360px;
object-fit:cover; background:var(–surface2);
}
.post-actions { display:flex; gap:4px; }
.post-action-btn {
background:none; border:none; color:var(–muted); font-size:13px; cursor:pointer;
display:flex; align-items:center; gap:5px; padding:6px 10px; border-radius:8px;
transition:all .2s; font-family:‘DM Sans’,sans-serif;
}
.post-action-btn:hover { background:rgba(192,132,252,0.08); color:var(–accent); }
.post-action-btn.liked { color:var(–danger); }
.post-action-btn.liked:hover { color:var(–danger); }

/* COMMENTS */
.comments-section { border-top:1px solid var(–border); margin-top:14px; padding-top:14px; display:none; }
.comments-section.open { display:block; }
.comment-item { display:flex; gap:9px; margin-bottom:12px; }
.comment-content { background:var(–surface2); border-radius:10px; padding:9px 12px; flex:1; }
.comment-author { font-size:12px; font-weight:600; margin-bottom:3px; }
.comment-text { font-size:13px; color:var(–muted); }
.comment-input-row { display:flex; gap:8px; margin-top:12px; }
.comment-input {
flex:1; background:var(–surface2); border:1px solid var(–border); border-radius:8px;
padding:8px 12px; color:var(–text); font-size:13px; font-family:‘DM Sans’,sans-serif;
outline:none; transition:border-color .2s;
}
.comment-input:focus { border-color:var(–accent); }
.comment-submit {
background:rgba(192,132,252,0.15); border:1px solid var(–accent); border-radius:8px;
padding:8px 14px; color:var(–accent); font-size:13px; cursor:pointer;
font-family:‘DM Sans’,sans-serif; transition:all .2s;
}
.comment-submit:hover { background:rgba(192,132,252,0.25); }

/* SUGGESTIONS */
.suggestions-box {
background:var(–surface); border:1px solid var(–border); border-radius:16px; padding:18px;
margin-bottom:16px;
}
.suggestions-title { font-size:13px; font-weight:600; color:var(–muted); margin-bottom:14px; text-transform:uppercase; letter-spacing:.06em; }
.suggest-item { display:flex; align-items:center; gap:10px; margin-bottom:12px; }
.suggest-info { flex:1; }
.suggest-info .name { font-size:13px; font-weight:600; }
.suggest-info .bio { font-size:11px; color:var(–muted); }
.follow-btn {
background:rgba(192,132,252,0.12); border:1px solid rgba(192,132,252,0.3); border-radius:8px;
padding:5px 12px; color:var(–accent); font-size:12px; font-weight:600; cursor:pointer;
font-family:‘DM Sans’,sans-serif; transition:all .2s;
}
.follow-btn:hover { background:rgba(192,132,252,0.25); }
.follow-btn.following { background:var(–surface3); border-color:var(–border); color:var(–muted); }

/* MESSAGES PAGE */
.messages-layout { display:flex; height:100%; }
.convo-list {
width:280px; border-right:1px solid var(–border);
display:flex; flex-direction:column; overflow:hidden;
}
.convo-list-header { padding:20px; font-size:18px; font-weight:700; border-bottom:1px solid var(–border); }
.convo-items { overflow-y:auto; flex:1; }
.convo-item {
display:flex; align-items:center; gap:12px; padding:14px 20px;
cursor:pointer; transition:background .2s; border-bottom:1px solid rgba(42,42,62,.4);
}
.convo-item:hover, .convo-item.active { background:rgba(192,132,252,0.06); }
.convo-item .name { font-size:14px; font-weight:600; }
.convo-item .preview { font-size:12px; color:var(–muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:140px; }
.convo-item .time { font-size:11px; color:var(–muted); margin-left:auto; flex-shrink:0; }
.convo-unread { width:8px; height:8px; background:var(–accent); border-radius:50%; flex-shrink:0; }

.chat-area { flex:1; display:flex; flex-direction:column; }
.chat-empty {
flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
color:var(–muted); gap:12px;
}
.chat-empty .icon { font-size:48px; opacity:.3; }
.chat-header {
padding:16px 20px; border-bottom:1px solid var(–border);
display:flex; align-items:center; gap:12px; flex-shrink:0;
}
.chat-messages { flex:1; overflow-y:auto; padding:20px; display:flex; flex-direction:column; gap:10px; }
.chat-messages::-webkit-scrollbar { width:4px; }
.chat-messages::-webkit-scrollbar-thumb { background:var(–border); border-radius:2px; }
.msg-bubble { max-width:68%; }
.msg-bubble.mine { align-self:flex-end; }
.msg-bubble .bubble-inner {
padding:10px 14px; border-radius:16px; font-size:14px; line-height:1.5;
background:var(–surface2); color:var(–text);
}
.msg-bubble.mine .bubble-inner {
background:linear-gradient(135deg, #7c3aed, #c084fc);
color:#fff;
}
.msg-bubble .bubble-time { font-size:10px; color:var(–muted); margin-top:3px; text-align:right; }
.chat-input-area {
padding:16px 20px; border-top:1px solid var(–border);
display:flex; gap:10px; align-items:center;
}
.chat-input {
flex:1; background:var(–surface2); border:1px solid var(–border); border-radius:24px;
padding:10px 16px; color:var(–text); font-family:‘DM Sans’,sans-serif; font-size:14px;
outline:none; transition:border-color .2s;
}
.chat-input:focus { border-color:var(–accent); }
.send-btn {
width:40px; height:40px; border-radius:50%; background:var(–gradient);
border:none; color:#fff; font-size:16px; cursor:pointer; display:flex;
align-items:center; justify-content:center; transition:transform .2s, opacity .2s;
flex-shrink:0;
}
.send-btn:hover { transform:scale(1.08); }

/* EXPLORE PAGE */
.explore-wrap { padding:24px; max-width:700px; margin:0 auto; width:100%; }
.search-bar {
background:var(–surface); border:1px solid var(–border); border-radius:14px;
padding:12px 18px; color:var(–text); font-family:‘DM Sans’,sans-serif; font-size:15px;
outline:none; width:100%; margin-bottom:24px; transition:border-color .2s;
}
.search-bar:focus { border-color:var(–accent); }
.explore-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:3px; }
.explore-tile {
aspect-ratio:1; background:var(–surface2); border-radius:4px; overflow:hidden;
display:flex; align-items:center; justify-content:center; cursor:pointer;
transition:opacity .2s; position:relative; font-size:32px;
}
.explore-tile:hover { opacity:.8; }
.explore-tile-label {
position:absolute; bottom:0; left:0; right:0; padding:8px;
background:linear-gradient(0deg, rgba(0,0,0,.7), transparent);
font-size:12px; font-weight:600;
}
.search-results { display:flex; flex-direction:column; gap:12px; }
.user-result {
display:flex; align-items:center; gap:12px; padding:14px;
background:var(–surface); border:1px solid var(–border); border-radius:14px;
cursor:pointer; transition:border-color .2s;
}
.user-result:hover { border-color:var(–accent); }
.user-result .info .name { font-size:15px; font-weight:600; }
.user-result .info .handle { font-size:13px; color:var(–muted); }

/* PROFILE PAGE */
.profile-wrap { padding:32px 24px; max-width:680px; margin:0 auto; width:100%; }
.profile-header { display:flex; align-items:flex-start; gap:24px; margin-bottom:32px; }
.profile-info .name { font-size:24px; font-weight:700; font-family:‘DM Serif Display’,serif; }
.profile-info .handle { color:var(–muted); font-size:14px; margin-bottom:10px; }
.profile-info .bio { font-size:14px; color:var(–muted); line-height:1.5; max-width:320px; margin-bottom:16px; }
.profile-stats { display:flex; gap:24px; }
.stat { text-align:center; }
.stat .n { font-size:20px; font-weight:700; font-family:‘DM Serif Display’,serif; }
.stat .l { font-size:12px; color:var(–muted); }
.profile-posts { display:grid; grid-template-columns:1fr 1fr 1fr; gap:3px; }
.profile-post-tile {
aspect-ratio:1; background:var(–surface2); border-radius:4px;
display:flex; align-items:center; justify-content:center; font-size:28px;
cursor:pointer; transition:opacity .2s; overflow:hidden; position:relative;
}
.profile-post-tile:hover { opacity:.75; }
.edit-profile-btn {
background:var(–surface2); border:1px solid var(–border); border-radius:10px;
padding:8px 18px; color:var(–text); font-family:‘DM Sans’,sans-serif;
font-size:13px; font-weight:600; cursor:pointer; transition:border-color .2s;
}
.edit-profile-btn:hover { border-color:var(–accent); color:var(–accent); }

/* NOTIFICATIONS */
.notif-wrap { padding:24px; max-width:600px; margin:0 auto; width:100%; }
.notif-section-title { font-size:12px; font-weight:600; color:var(–muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px; margin-top:20px; }
.notif-item {
display:flex; align-items:center; gap:12px; padding:14px;
background:var(–surface); border:1px solid var(–border); border-radius:14px;
margin-bottom:8px; transition:border-color .2s;
}
.notif-item:hover { border-color:var(–surface3); }
.notif-icon { width:38px; height:38px; border-radius:50%; background:rgba(192,132,252,0.12); display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
.notif-text { font-size:14px; }
.notif-text .bold { font-weight:600; }
.notif-time { font-size:11px; color:var(–muted); margin-left:auto; flex-shrink:0; }
.notif-unread-dot { width:6px; height:6px; background:var(–accent); border-radius:50%; flex-shrink:0; }

/* STORY MODAL */
.story-modal {
display:none; position:fixed; inset:0; background:rgba(0,0,0,.9);
z-index:500; align-items:center; justify-content:center;
}
.story-modal.open { display:flex; }
.story-view {
width:380px; height:620px; max-height:90vh; background:var(–surface2);
border-radius:20px; overflow:hidden; position:relative;
background:var(–gradient); display:flex; flex-direction:column;
}
.story-progress { display:flex; gap:4px; padding:14px 14px 8px; }
.story-prog-bar { flex:1; height:2px; background:rgba(255,255,255,.3); border-radius:2px; overflow:hidden; }
.story-prog-fill { height:100%; background:#fff; transition:width 5s linear; }
.story-top { display:flex; align-items:center; gap:10px; padding:8px 14px; }
.story-user { font-size:14px; font-weight:600; color:#fff; }
.story-time-label { font-size:12px; color:rgba(255,255,255,.7); margin-left:4px; }
.story-close { margin-left:auto; background:none; border:none; color:#fff; font-size:22px; cursor:pointer; }
.story-content { flex:1; display:flex; align-items:center; justify-content:center; padding:20px; }
.story-text { font-size:22px; font-weight:600; color:#fff; text-align:center; line-height:1.4; font-family:‘DM Serif Display’,serif; font-style:italic; }
.story-reply { padding:14px; display:flex; gap:10px; }
.story-reply-input {
flex:1; background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.3);
border-radius:24px; padding:9px 16px; color:#fff; font-family:‘DM Sans’,sans-serif;
font-size:13px; outline:none;
}
.story-reply-input::placeholder { color:rgba(255,255,255,.5); }
.story-send-btn { background:rgba(255,255,255,.2); border:none; border-radius:50%; width:38px; height:38px; color:#fff; font-size:16px; cursor:pointer; }

/* TOAST */
#toast {
position:fixed; bottom:28px; left:50%; transform:translateX(-50%) translateY(80px);
background:var(–surface3); border:1px solid var(–border); border-radius:10px;
padding:10px 20px; font-size:13px; color:var(–text); z-index:900;
transition:transform .3s ease; white-space:nowrap; pointer-events:none;
box-shadow:0 8px 24px rgba(0,0,0,.4);
}
#toast.show { transform:translateX(-50%) translateY(0); }

/* UTILS */
.hidden { display:none !important; }
.section-header { font-size:18px; font-weight:700; font-family:‘DM Serif Display’,serif; padding:20px 24px 0; }
.tag { display:inline-flex; align-items:center; gap:4px; background:rgba(192,132,252,0.1); border:1px solid rgba(192,132,252,0.2); border-radius:6px; padding:2px 8px; font-size:12px; color:var(–accent); }
.loading { color:var(–muted); font-size:14px; display:flex; align-items:center; gap:8px; padding:20px; }
.loading::before { content:’’; width:14px; height:14px; border:2px solid var(–border); border-top-color:var(–accent); border-radius:50%; animation:spin .7s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

@media (max-width:768px) {
.sidebar { display:none; }
.feed-right { display:none; }
.convo-list { width:100%; }
}
</style>

</head>
<body>

<!-- AUTH SCREEN -->

<div id="auth-screen">
  <div class="auth-box">
    <div class="auth-logo">Aura</div>
    <div class="auth-tagline">Share your world, connect your aura</div>
    <div class="auth-tabs">
      <button class="auth-tab active" onclick="switchTab('login')">Sign In</button>
      <button class="auth-tab" onclick="switchTab('signup')">Create Account</button>
    </div>
    <!-- LOGIN FORM -->
    <div class="auth-form" id="login-form">
      <div class="field-group">
        <label>Username</label>
        <input type="text" id="login-user" placeholder="your username" />
      </div>
      <div class="field-group">
        <label>Password</label>
        <input type="password" id="login-pass" placeholder="••••••••" />
      </div>
      <div class="auth-error" id="login-error"></div>
      <button class="btn-primary" onclick="doLogin()">Sign In</button>
    </div>
    <!-- SIGNUP FORM -->
    <div class="auth-form hidden" id="signup-form">
      <div class="field-group">
        <label>Display Name</label>
        <input type="text" id="su-name" placeholder="Your Name" />
      </div>
      <div class="field-group">
        <label>Username</label>
        <input type="text" id="su-user" placeholder="@username" />
      </div>
      <div class="field-group">
        <label>Bio</label>
        <input type="text" id="su-bio" placeholder="A short bio..." />
      </div>
      <div class="field-group">
        <label>Password</label>
        <input type="password" id="su-pass" placeholder="••••••••" />
      </div>
      <div class="auth-error" id="signup-error"></div>
      <button class="btn-primary" onclick="doSignup()">Create Account</button>
    </div>
  </div>
</div>

<!-- MAIN APP -->

<div id="app">
  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="sidebar-logo">Aura</div>
    <div class="nav-item active" onclick="showPage('feed')" id="nav-feed">
      <span class="icon">🏠</span> Home
    </div>
    <div class="nav-item" onclick="showPage('explore')" id="nav-explore">
      <span class="icon">🔍</span> Explore
    </div>
    <div class="nav-item" onclick="showPage('notifications')" id="nav-notifications">
      <span class="icon">🔔</span> Notifications
    </div>
    <div class="nav-item" onclick="showPage('messages')" id="nav-messages">
      <span class="icon">💬</span> Messages
    </div>
    <div class="nav-item" onclick="showPage('profile')" id="nav-profile">
      <span class="icon">👤</span> Profile
    </div>
    <div class="nav-bottom">
      <div class="user-chip">
        <div class="avatar" id="sidebar-avatar"></div>
        <div class="user-info">
          <div class="name" id="sidebar-name"></div>
          <div class="handle" id="sidebar-handle"></div>
        </div>
        <button class="logout-btn" onclick="doLogout()" title="Sign out">↩</button>
      </div>
    </div>
  </div>

  <!-- MAIN CONTENT -->

  <div class="main">
    <!-- FEED PAGE -->
    <div class="page active" id="page-feed">
      <div class="feed-layout">
        <div class="feed-center">
          <!-- Stories -->
          <div class="stories-row" id="stories-row"></div>
          <!-- Create Post -->
          <div class="create-post">
            <div class="create-post-top">
              <div class="avatar sm" id="post-creator-avatar"></div>
              <textarea class="create-post-input" id="post-input" placeholder="What's on your mind?"></textarea>
            </div>
            <div class="create-post-actions">
              <button class="icon-btn" onclick="addEmojiToPost()">😊 Emoji</button>
              <button class="icon-btn btn-primary post-btn" onclick="createPost()">Post</button>
            </div>
          </div>
          <!-- Posts Feed -->
          <div id="posts-feed"></div>
        </div>
        <div class="feed-right">
          <div class="suggestions-box">
            <div class="suggestions-title">Who to follow</div>
            <div id="suggestions-list"></div>
          </div>
        </div>
      </div>
    </div>

```
<!-- EXPLORE PAGE -->
<div class="page" id="page-explore">
  <div class="explore-wrap">
    <input class="search-bar" placeholder="🔍  Search people, topics..." id="search-input" oninput="doSearch(this.value)" />
    <div id="explore-content"></div>
  </div>
</div>

<!-- NOTIFICATIONS PAGE -->
<div class="page" id="page-notifications">
  <div class="notif-wrap">
    <div style="font-size:22px;font-weight:700;font-family:'DM Serif Display',serif;margin-bottom:20px;">Notifications</div>
    <div id="notifs-list"></div>
  </div>
</div>

<!-- MESSAGES PAGE -->
<div class="page" id="page-messages">
  <div class="messages-layout">
    <div class="convo-list">
      <div class="convo-list-header">Messages</div>
      <div class="convo-items" id="convo-items"></div>
    </div>
    <div class="chat-area" id="chat-area">
      <div class="chat-empty">
        <div class="icon">💬</div>
        <div>Select a conversation</div>
      </div>
    </div>
  </div>
</div>

<!-- PROFILE PAGE -->
<div class="page" id="page-profile">
  <div class="profile-wrap">
    <div class="profile-header" id="profile-header"></div>
    <div class="profile-posts" id="profile-posts-grid"></div>
  </div>
</div>
```

  </div>
</div>

<!-- STORY MODAL -->

<div class="story-modal" id="story-modal" onclick="closeStory(event)">
  <div class="story-view" id="story-view">
    <div class="story-progress" id="story-progress"></div>
    <div class="story-top">
      <div class="avatar sm" id="story-avatar"></div>
      <span class="story-user" id="story-username"></span>
      <span class="story-time-label" id="story-time-label"></span>
      <button class="story-close" onclick="closeStoryModal()">✕</button>
    </div>
    <div class="story-content">
      <div class="story-text" id="story-text"></div>
    </div>
    <div class="story-reply">
      <input class="story-reply-input" placeholder="Reply to story..." id="story-reply-input" />
      <button class="story-send-btn" onclick="sendStoryReply()">➤</button>
    </div>
  </div>
</div>

<!-- TOAST -->

<div id="toast"></div>

<script>
// ==================== STATE ====================
let DB = {
  users: [
    { id:'u1', name:'Luna Park', username:'lunapark', password:'luna123', bio:'Digital dreamer & coffee addict ☕', emoji:'🌙', followers:['u2','u3'], following:['u2'] },
    { id:'u2', name:'Kai Storm', username:'kaistorm', password:'kai123', bio:'Photographer | Traveler | Noodle enthusiast 🍜', emoji:'⚡', followers:['u1'], following:['u1','u3'] },
    { id:'u3', name:'River Song', username:'riversong', password:'riv123', bio:'making beats & finding peace 🎵', emoji:'🌊', followers:['u1','u2'], following:['u1'] },
    { id:'u4', name:'Nova Chen', username:'novachen', password:'nov123', bio:'UI designer & sunlight collector ☀️', emoji:'⭐', followers:[], following:[] },
  ],
  posts: [
    { id:'p1', userId:'u2', text:"Golden hour hits different when you're on top of the world 🌅", likes:['u1','u3'], comments:[{userId:'u1',text:'Stunning!! Where is this?',time:'2h'}], time:'3h', emoji:'🌅' },
    { id:'p2', userId:'u3', text:"Dropped a new beat today. Sometimes the silence between notes matters more than the notes themselves 🎵", likes:['u1','u2'], comments:[], time:'5h', emoji:'🎵' },
    { id:'p3', userId:'u4', text:"Redesigned my whole portfolio this weekend. Sometimes you just need to tear everything down and start fresh ✨", likes:['u2'], comments:[{userId:'u2',text:'Love the new direction!',time:'1h'}], time:'8h', emoji:'✨' },
    { id:'p4', userId:'u1', text:"Morning walk thoughts: the world is simultaneously huge and tiny. Wild 🌍", likes:['u2','u3','u4'], comments:[], time:'12h', emoji:'🌍' },
  ],
  stories: [
    { id:'s1', userId:'u2', text:"Just landed in Kyoto! 🇯🇵", time:'2h', seen:[] },
    { id:'s2', userId:'u3', text:"Studio session until 3am… worth it 🎧", time:'4h', seen:[] },
    { id:'s3', userId:'u4', text:"New portfolio drop today 🚀", time:'6h', seen:[] },
    { id:'s1b', userId:'u1', text:"Good morning, beautiful world ☀️", time:'1h', seen:[] },
  ],
  messages: {
    'u1-u2': [
      { from:'u2', text:'Hey! How are you?', time:'10:32 AM' },
      { from:'u1', text:'Doing great! Love your latest photos 😍', time:'10:33 AM' },
      { from:'u2', text:'Thank you so much!! 🙏', time:'10:34 AM' },
    ],
    'u1-u3': [
      { from:'u3', text:'Did you hear the new track?', time:'Yesterday' },
      { from:'u1', text:'YES omg it slaps 🔥', time:'Yesterday' },
    ],
  },
  notifications: [
    { id:'n1', type:'like', fromUserId:'u2', postId:'p4', time:'5m' },
    { id:'n2', type:'follow', fromUserId:'u3', time:'1h' },
    { id:'n3', type:'comment', fromUserId:'u4', postId:'p4', text:'Amazing post!', time:'2h' },
    { id:'n4', type:'like', fromUserId:'u3', postId:'p1', time:'3h' },
  ]
};

let currentUser = null;
let activeConvoId = null;
let storyTimer = null;

// ==================== AUTH ====================
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i) => t.classList.toggle('active', (i===0 && tab==='login') || (i===1 && tab==='signup')));
  document.getElementById('login-form').classList.toggle('hidden', tab!=='login');
  document.getElementById('signup-form').classList.toggle('hidden', tab!=='signup');
}

function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value;
  const err = document.getElementById('login-error');
  const user = DB.users.find(x => (x.username===u||x.name===u) && x.password===p);
  if (!user) { err.textContent='Invalid username or password.'; return; }
  err.textContent='';
  loginAs(user);
}

function doSignup() {
  const name = document.getElementById('su-name').value.trim();
  const username = document.getElementById('su-user').value.trim().replace('@','');
  const bio = document.getElementById('su-bio').value.trim();
  const pass = document.getElementById('su-pass').value;
  const err = document.getElementById('signup-error');
  if (!name||!username||!pass) { err.textContent='Please fill in all required fields.'; return; }
  if (DB.users.find(x=>x.username===username)) { err.textContent='Username already taken.'; return; }
  const emojis = ['🎯','🎨','🌺','🦋','🚀','🌟','🎸','🧩'];
  const newUser = {
    id: 'u'+Date.now(), name, username, password:pass, bio:bio||'New to Aura!',
    emoji: emojis[Math.floor(Math.random()*emojis.length)],
    followers:[], following:[]
  };
  DB.users.push(newUser);
  err.textContent='';
  loginAs(newUser);
}

function loginAs(user) {
  currentUser = user;
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app').classList.add('visible');
  renderSidebar();
  renderFeed();
  renderMessages();
  renderNotifications();
  renderProfile();
}

function doLogout() {
  currentUser = null;
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app').classList.remove('visible');
  document.getElementById('login-user').value='';
  document.getElementById('login-pass').value='';
}

// ==================== NAVIGATION ====================
function showPage(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.getElementById('nav-'+page).classList.add('active');
  if (page==='explore') renderExplore();
  if (page==='profile') renderProfile();
}

// ==================== SIDEBAR ====================
function renderSidebar() {
  const u = currentUser;
  document.getElementById('sidebar-avatar').textContent = u.emoji;
  document.getElementById('sidebar-name').textContent = u.name;
  document.getElementById('sidebar-handle').textContent = '@'+u.username;
  document.getElementById('post-creator-avatar').textContent = u.emoji;
}

// ==================== FEED ====================
function renderFeed() {
  renderStories();
  renderPosts();
  renderSuggestions();
}

function renderStories() {
  const row = document.getElementById('stories-row');
  row.innerHTML = '';
  // Add story btn
  const addBtn = document.createElement('div');
  addBtn.innerHTML = `<div class="story-add-btn" onclick="addStory()">+</div><div class="story-label">Your story</div>`;
  addBtn.style.display='flex'; addBtn.style.flexDirection='column'; addBtn.style.alignItems='center'; addBtn.style.gap='6px';
  row.appendChild(addBtn);

  // My story if exists
  const myStory = DB.stories.find(s=>s.userId===currentUser.id);

  // Get unique users with stories
  const storyUsers = [...new Set(DB.stories.filter(s=>s.userId!==currentUser.id).map(s=>s.userId))];
  if (myStory) storyUsers.unshift(currentUser.id);

  storyUsers.forEach(uid => {
    const u = DB.users.find(x=>x.id===uid);
    if (!u) return;
    const stories = DB.stories.filter(s=>s.userId===uid);
    const allSeen = stories.every(s=>s.seen.includes(currentUser.id));
    const div = document.createElement('div');
    div.className='story-bubble';
    div.onclick = () => openStory(uid);
    div.innerHTML = `
      <div class="story-ring ${allSeen?'seen':''}">
        <div class="story-inner">${u.emoji}</div>
      </div>
      <div class="story-label">${uid===currentUser.id?'You':u.name.split(' ')[0]}</div>
    `;
    row.appendChild(div);
  });
}

function addStory() {
  const text = prompt('What\'s your story? (type your update)');
  if (!text) return;
  DB.stories.push({ id:'s'+Date.now(), userId:currentUser.id, text, time:'now', seen:[] });
  renderStories();
  showToast('Story posted! ✨');
}

function openStory(userId) {
  const stories = DB.stories.filter(s=>s.userId===userId);
  if (!stories.length) return;
  const story = stories[0];
  const u = DB.users.find(x=>x.id===userId);
  // Mark seen
  if (!story.seen.includes(currentUser.id)) story.seen.push(currentUser.id);

  document.getElementById('story-avatar').textContent = u.emoji;
  document.getElementById('story-username').textContent = u.name;
  document.getElementById('story-time-label').textContent = story.time + ' ago';
  document.getElementById('story-text').textContent = story.text;

  // Progress bars
  const prog = document.getElementById('story-progress');
  prog.innerHTML = stories.map((_,i)=>`<div class="story-prog-bar"><div class="story-prog-fill" style="width:${i===0?'0%':'0%'}" id="prog-${i}"></div></div>`).join('');
  setTimeout(()=>{ const f=document.getElementById('prog-0'); if(f) f.style.width='100%'; },50);

  document.getElementById('story-modal').classList.add('open');
  if (storyTimer) clearTimeout(storyTimer);
  storyTimer = setTimeout(closeStoryModal, 5500);
}

function closeStory(e) { if (e.target===document.getElementById('story-modal')) closeStoryModal(); }
function closeStoryModal() {
  document.getElementById('story-modal').classList.remove('open');
  if (storyTimer) clearTimeout(storyTimer);
  renderStories();
}

function sendStoryReply() {
  const val = document.getElementById('story-reply-input').value.trim();
  if (!val) return;
  document.getElementById('story-reply-input').value='';
  showToast('Reply sent! 💬');
  closeStoryModal();
}

function renderPosts() {
  const feed = document.getElementById('posts-feed');
  const posts = [...DB.posts].reverse();
  feed.innerHTML = posts.map(p => renderPostHTML(p)).join('');
}

function renderPostHTML(post) {
  const u = DB.users.find(x=>x.id===post.userId);
  if (!u) return '';
  const liked = post.likes.includes(currentUser.id);
  const commentsHTML = post.comments.map(c => {
    const cu = DB.users.find(x=>x.id===c.userId);
    return `<div class="comment-item">
      <div class="avatar sm">${cu?cu.emoji:'👤'}</div>
      <div class="comment-content">
        <div class="comment-author">${cu?cu.name:'Unknown'}</div>
        <div class="comment-text">${c.text}</div>
      </div>
    </div>`;
  }).join('');

  return `<div class="post-card" id="post-${post.id}">
    <div class="post-header">
      <div class="avatar">${u.emoji}</div>
      <div class="post-meta">
        <div class="name">${u.name}</div>
        <div class="time">@${u.username} · ${post.time} ago</div>
      </div>
    </div>
    <div class="post-content">${post.text}</div>
    <div class="post-actions">
      <button class="post-action-btn ${liked?'liked':''}" onclick="toggleLike('${post.id}')">
        ${liked?'❤️':'🤍'} ${post.likes.length}
      </button>
      <button class="post-action-btn" onclick="toggleComments('${post.id}')">
        💬 ${post.comments.length}
      </button>
      <button class="post-action-btn" onclick="sharePost('${post.id}')">
        ↗ Share
      </button>
    </div>
    <div class="comments-section" id="comments-${post.id}">
      <div id="comments-list-${post.id}">${commentsHTML}</div>
      <div class="comment-input-row">
        <input class="comment-input" placeholder="Add a comment..." id="comment-input-${post.id}" onkeydown="if(event.key==='Enter')addComment('${post.id}')" />
        <button class="comment-submit" onclick="addComment('${post.id}')">Post</button>
      </div>
    </div>
  </div>`;
}

function createPost() {
  const input = document.getElementById('post-input');
  const text = input.value.trim();
  if (!text) return;
  const post = {
    id: 'p'+Date.now(), userId:currentUser.id,
    text, likes:[], comments:[], time:'just now',
    emoji: '✨'
  };
  DB.posts.unshift(post);
  input.value = '';
  renderPosts();
  showToast('Post published! 🚀');
  // Add notification for followers
  DB.notifications.unshift({ id:'notif'+Date.now(), type:'post', fromUserId:currentUser.id, time:'just now' });
}

function addEmojiToPost() {
  const emojis = ['😊','🔥','✨','💫','🎉','❤️','🌟','🎵','🌈','🚀'];
  const e = emojis[Math.floor(Math.random()*emojis.length)];
  document.getElementById('post-input').value += ' '+e;
  document.getElementById('post-input').focus();
}

function toggleLike(postId) {
  const post = DB.posts.find(p=>p.id===postId);
  if (!post) return;
  const idx = post.likes.indexOf(currentUser.id);
  if (idx===-1) {
    post.likes.push(currentUser.id);
    if (post.userId!==currentUser.id) {
      DB.notifications.unshift({ id:'n'+Date.now(), type:'like', fromUserId:currentUser.id, postId, time:'just now' });
    }
  } else {
    post.likes.splice(idx,1);
  }
  // Re-render just this post
  const el = document.getElementById('post-'+postId);
  if (el) {
    const tmp = document.createElement('div');
    tmp.innerHTML = renderPostHTML(post);
    el.replaceWith(tmp.firstChild);
  }
}

function toggleComments(postId) {
  const sec = document.getElementById('comments-'+postId);
  if (sec) sec.classList.toggle('open');
}

function addComment(postId) {
  const input = document.getElementById('comment-input-'+postId);
  const text = input.value.trim();
  if (!text) return;
  const post = DB.posts.find(p=>p.id===postId);
  if (!post) return;
  post.comments.push({ userId:currentUser.id, text, time:'just now' });
  input.value='';
  if (post.userId!==currentUser.id) {
    DB.notifications.unshift({ id:'n'+Date.now(), type:'comment', fromUserId:currentUser.id, postId, text, time:'just now' });
  }
  const list = document.getElementById('comments-list-'+postId);
  const cu = currentUser;
  if (list) {
    const div = document.createElement('div');
    div.className='comment-item';
    div.innerHTML=`<div class="avatar sm">${cu.emoji}</div>
      <div class="comment-content">
        <div class="comment-author">${cu.name}</div>
        <div class="comment-text">${text}</div>
      </div>`;
    list.appendChild(div);
  }
  showToast('Comment posted!');
  const btn = document.querySelector(`#post-${postId} .post-action-btn:nth-child(2)`);
  if (btn) btn.textContent = '💬 '+post.comments.length;
}

function sharePost(postId) { showToast('Link copied to clipboard! 🔗'); }

function renderSuggestions() {
  const list = document.getElementById('suggestions-list');
  const others = DB.users.filter(u=>u.id!==currentUser.id && !currentUser.following.includes(u.id)).slice(0,4);
  list.innerHTML = others.map(u=>`
    <div class="suggest-item">
      <div class="avatar sm">${u.emoji}</div>
      <div class="suggest-info">
        <div class="name">${u.name}</div>
        <div class="bio">${u.bio.substring(0,28)}...</div>
      </div>
      <button class="follow-btn" id="follow-btn-${u.id}" onclick="toggleFollow('${u.id}')">${currentUser.following.includes(u.id)?'Following':'Follow'}</button>
    </div>
  `).join('') || '<div style="color:var(--muted);font-size:13px">No suggestions right now</div>';
}

function toggleFollow(userId) {
  const u = DB.users.find(x=>x.id===userId);
  if (!u) return;
  const idx = currentUser.following.indexOf(userId);
  if (idx===-1) {
    currentUser.following.push(userId);
    u.followers.push(currentUser.id);
    DB.notifications.unshift({ id:'n'+Date.now(), type:'follow', fromUserId:currentUser.id, time:'just now' });
    showToast('Following '+u.name+' ✨');
  } else {
    currentUser.following.splice(idx,1);
    u.followers.splice(u.followers.indexOf(currentUser.id),1);
    showToast('Unfollowed '+u.name);
  }
  renderSuggestions();
  renderProfile();
}

// ==================== EXPLORE ====================
function renderExplore() {
  const q = document.getElementById('search-input').value.trim();
  doSearch(q);
}

function doSearch(q) {
  const cont = document.getElementById('explore-content');
  if (!q) {
    // Show grid
    const emojis = ['🌅','🎵','🌿','🏙️','🎨','🍜','🌊','📚','🎸','🌺','🏔️','✨'];
    cont.innerHTML = `<div class="explore-grid">
      ${emojis.map(e=>`<div class="explore-tile" onclick="showToast('Exploring ${e}...')">${e}</div>`).join('')}
    </div>`;
    return;
  }
  const results = DB.users.filter(u=>
    u.id!==currentUser.id &&
    (u.name.toLowerCase().includes(q.toLowerCase()) || u.username.toLowerCase().includes(q.toLowerCase()))
  );
  cont.innerHTML = `<div class="search-results">
    ${results.length ? results.map(u=>`
      <div class="user-result" onclick="viewUserProfile('${u.id}')">
        <div class="avatar">${u.emoji}</div>
        <div class="info">
          <div class="name">${u.name}</div>
          <div class="handle">@${u.username}</div>
        </div>
        <button class="follow-btn" onclick="event.stopPropagation();toggleFollow('${u.id}');this.textContent=currentUser.following.includes('${u.id}')?'Following':'Follow'">${currentUser.following.includes(u.id)?'Following':'Follow'}</button>
      </div>
    `).join('') : '<div style="color:var(--muted);text-align:center;padding:40px 0">No users found for "'+q+'"</div>'}
  </div>`;
}

function viewUserProfile(userId) {
  showToast('Viewing profile...');
}

// ==================== NOTIFICATIONS ====================
function renderNotifications() {
  const list = document.getElementById('notifs-list');
  const icons = { like:'❤️', follow:'👤', comment:'💬', post:'📝' };
  const msgs = {
    like: (n) => { const u=DB.users.find(x=>x.id===n.fromUserId); return u?`<span class="bold">${u.name}</span> liked your post`:''; },
    follow: (n) => { const u=DB.users.find(x=>x.id===n.fromUserId); return u?`<span class="bold">${u.name}</span> started following you`:''; },
    comment: (n) => { const u=DB.users.find(x=>x.id===n.fromUserId); return u?`<span class="bold">${u.name}</span> commented: "${n.text||''}"` :''; },
    post: (n) => { const u=DB.users.find(x=>x.id===n.fromUserId); return u?`<span class="bold">${u.name}</span> posted something new`:''; },
  };
  list.innerHTML = DB.notifications.map(n=>`
    <div class="notif-item">
      <div class="notif-icon">${icons[n.type]||'🔔'}</div>
      <div class="notif-text">${msgs[n.type]?.(n)||n.type}</div>
      <div class="notif-time">${n.time}</div>
    </div>
  `).join('') || '<div style="color:var(--muted);text-align:center;padding:40px 0">No notifications yet</div>';
}

// ==================== MESSAGES ====================
function renderMessages() {
  const items = document.getElementById('convo-items');
  const chatPartners = DB.users.filter(u=>u.id!==currentUser.id);
  items.innerHTML = chatPartners.map(u=>{
    const key = [currentUser.id,u.id].sort().join('-');
    const msgs = DB.messages[key]||[];
    const last = msgs[msgs.length-1];
    return `<div class="convo-item" id="convo-${u.id}" onclick="openChat('${u.id}')">
      <div class="avatar sm">${u.emoji}</div>
      <div style="flex:1;overflow:hidden">
        <div class="name">${u.name}</div>
        <div class="preview">${last?last.text:'Say hi!'}</div>
      </div>
      <div class="time">${last?'':'·'}</div>
    </div>`;
  }).join('');
}

function openChat(userId) {
  activeConvoId = userId;
  document.querySelectorAll('.convo-item').forEach(i=>i.classList.remove('active'));
  const ci = document.getElementById('convo-'+userId);
  if (ci) ci.classList.add('active');

  const u = DB.users.find(x=>x.id===userId);
  const key = [currentUser.id,userId].sort().join('-');
  if (!DB.messages[key]) DB.messages[key]=[];
  const msgs = DB.messages[key];

  const area = document.getElementById('chat-area');
  area.innerHTML = `
    <div class="chat-header">
      <div class="avatar sm">${u.emoji}</div>
      <div>
        <div style="font-size:15px;font-weight:600">${u.name}</div>
        <div style="font-size:12px;color:var(--muted)">@${u.username}</div>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages">
      ${msgs.map(m=>`
        <div class="msg-bubble ${m.from===currentUser.id?'mine':''}">
          <div class="bubble-inner">${m.text}</div>
          <div class="bubble-time">${m.time}</div>
        </div>
      `).join('')}
    </div>
    <div class="chat-input-area">
      <input class="chat-input" placeholder="Send a message..." id="chat-input" onkeydown="if(event.key==='Enter')sendMessage()" />
      <button class="send-btn" onclick="sendMessage()">➤</button>
    </div>
  `;
  const cm = document.getElementById('chat-messages');
  if (cm) cm.scrollTop = cm.scrollHeight;
}

function sendMessage() {
  if (!activeConvoId) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  const key = [currentUser.id,activeConvoId].sort().join('-');
  if (!DB.messages[key]) DB.messages[key]=[];
  const now = new Date();
  const time = now.getHours()+':'+(now.getMinutes()+'').padStart(2,'0');
  DB.messages[key].push({ from:currentUser.id, text, time });
  input.value='';

  const cm = document.getElementById('chat-messages');
  if (cm) {
    const div = document.createElement('div');
    div.className='msg-bubble mine';
    div.innerHTML=`<div class="bubble-inner">${text}</div><div class="bubble-time">${time}</div>`;
    cm.appendChild(div);
    cm.scrollTop=cm.scrollHeight;
  }

  // Simulate reply after 1.5s
  const partner = DB.users.find(u=>u.id===activeConvoId);
  setTimeout(()=>{
    if (activeConvoId !== partner.id) return;
    const replies = ['That\'s amazing! 😊','Totally agree!','Haha 😂','No way!!','Tell me more!','You\'re the best ❤️','Sounds good!','I was just thinking that!'];
    const reply = replies[Math.floor(Math.random()*replies.length)];
    const t2 = new Date().getHours()+':'+(new Date().getMinutes()+'').padStart(2,'0');
    DB.messages[key].push({ from:partner.id, text:reply, time:t2 });
    const cm2 = document.getElementById('chat-messages');
    if (cm2) {
      const div = document.createElement('div');
      div.className='msg-bubble';
      div.innerHTML=`<div class="bubble-inner">${reply}</div><div class="bubble-time">${t2}</div>`;
      cm2.appendChild(div);
      cm2.scrollTop=cm2.scrollHeight;
    }
    renderMessages();
  }, 1500);

  renderMessages();
}

// ==================== PROFILE ====================
function renderProfile() {
  const u = currentUser;
  const myPosts = DB.posts.filter(p=>p.userId===u.id);
  document.getElementById('profile-header').innerHTML = `
    <div class="avatar xl">${u.emoji}</div>
    <div class="profile-info">
      <div class="name">${u.name}</div>
      <div class="handle">@${u.username}</div>
      <div class="bio">${u.bio}</div>
      <div class="profile-stats">
        <div class="stat"><div class="n">${myPosts.length}</div><div class="l">Posts</div></div>
        <div class="stat"><div class="n">${u.followers.length}</div><div class="l">Followers</div></div>
        <div class="stat"><div class="n">${u.following.length}</div><div class="l">Following</div></div>
      </div>
      <div style="margin-top:14px;display:flex;gap:10px">
        <button class="edit-profile-btn" onclick="editProfile()">Edit Profile</button>
        <button class="edit-profile-btn" onclick="addStory()">+ Add Story</button>
      </div>
    </div>
  `;

  const grid = document.getElementById('profile-posts-grid');
  grid.innerHTML = myPosts.length
    ? myPosts.map(p=>`<div class="profile-post-tile" onclick="showPostModal('${p.id}')" title="${p.text}">${p.emoji||'📝'}<div style="position:absolute;bottom:6px;right:8px;font-size:10px;color:rgba(255,255,255,.7)">❤️${p.likes.length}</div></div>`).join('')
    : '<div style="color:var(--muted);font-size:14px;padding:24px;grid-column:1/-1">No posts yet. Share something!</div>';
}

function editProfile() {
  const name = prompt('Display name:', currentUser.name);
  if (name) currentUser.name = name;
  const bio = prompt('Bio:', currentUser.bio);
  if (bio !== null) currentUser.bio = bio;
  renderProfile();
  renderSidebar();
  showToast('Profile updated! ✨');
}

function showPostModal(postId) {
  showToast('Post details coming soon!');
}

// ==================== TOAST ====================
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2500);
}

// ==================== INIT ====================
// Keyboard shortcut: Enter in auth forms
document.getElementById('login-pass').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
document.getElementById('su-pass').addEventListener('keydown', e=>{ if(e.key==='Enter') doSignup(); });
</script>

</body>
</html>
