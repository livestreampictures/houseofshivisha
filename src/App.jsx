import { useState, useEffect, useRef, useCallback } from "react";

/* ─── FONTS & GLOBAL CSS ─────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400;1,600&family=Jost:wght@300;400;500;600;700&display=swap');
:root {
  --bg: #06060A;
  --surface: #0F0F14;
  --surface2: #18181F;
  --border: #28282E;
  --gold: #C9963A;
  --gold-light: #E8B355;
  --gold-pale: rgba(201,150,58,0.12);
  --cream: #F5EDD6;
  --white: #FAFAF8;
  --muted: #6B6B75;
  --danger: #E05555;
  --success: #3DBD8A;
}
*{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{font-family:'Jost',sans-serif;background:var(--bg);color:var(--white);min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:var(--surface);}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}
input,select,textarea{font-family:'Jost',sans-serif;}
button{font-family:'Jost',sans-serif;cursor:pointer;}

/* ANIMATIONS */
@keyframes fadeUp{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
@keyframes slideIn{from{opacity:0;transform:translateX(-16px);}to{opacity:1;transform:translateX(0);}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.94);}to{opacity:1;transform:scale(1);}}
@keyframes glow{0%,100%{box-shadow:0 0 20px rgba(201,150,58,0.2);}50%{box-shadow:0 0 40px rgba(201,150,58,0.4);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}

.fade-up{animation:fadeUp 0.5s ease forwards;}
.fade-up-1{animation:fadeUp 0.5s 0.1s ease both;}
.fade-up-2{animation:fadeUp 0.5s 0.2s ease both;}
.fade-up-3{animation:fadeUp 0.5s 0.3s ease both;}
.fade-up-4{animation:fadeUp 0.5s 0.4s ease both;}
.slide-in{animation:slideIn 0.35s ease forwards;}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;border-bottom:1px solid var(--border);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(6,6,10,0.85);}
.nav-inner{max-width:1380px;margin:0 auto;padding:0 32px;height:64px;display:flex;align-items:center;gap:24px;}
.logo{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;letter-spacing:2px;color:var(--gold);cursor:pointer;text-transform:uppercase;white-space:nowrap;flex-shrink:0;}
.logo em{color:var(--cream);font-style:normal;}
.nav-search-wrap{flex:1;max-width:480px;position:relative;}
.nav-search-wrap input{width:100%;background:var(--surface);border:1px solid var(--border);color:var(--white);padding:9px 16px 9px 42px;border-radius:8px;font-size:13.5px;outline:none;transition:border-color 0.2s,background 0.2s;}
.nav-search-wrap input:focus{border-color:var(--gold);background:var(--surface2);}
.nav-search-wrap input::placeholder{color:var(--muted);}
.nav-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);font-size:15px;pointer-events:none;}
.nav-actions{margin-left:auto;display:flex;align-items:center;gap:10px;flex-shrink:0;}
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 20px;border-radius:8px;font-size:13.5px;font-weight:500;border:none;transition:all 0.2s;cursor:pointer;letter-spacing:0.3px;}
.btn-ghost{background:transparent;color:var(--muted);}
.btn-ghost:hover{color:var(--white);background:var(--surface2);}
.btn-outline{background:transparent;border:1px solid var(--gold);color:var(--gold);}
.btn-outline:hover{background:var(--gold-pale);}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold-light));color:#06060A;font-weight:700;}
.btn-gold:hover{filter:brightness(1.1);transform:translateY(-1px);}
.btn-danger{background:var(--danger);color:#fff;}
.btn-success{background:var(--success);color:#fff;}
.avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-light));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#06060A;cursor:pointer;flex-shrink:0;border:2px solid var(--border);}
.badge-count{background:var(--danger);color:#fff;font-size:10px;font-weight:700;border-radius:10px;padding:1px 5px;margin-left:2px;}

/* MAIN */
.main{padding-top:64px;min-height:100vh;}
.container{max-width:1380px;margin:0 auto;padding:0 32px;}

/* HERO */
.hero{position:relative;overflow:hidden;padding:90px 0 80px;border-bottom:1px solid var(--border);}
.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 65% 40%, rgba(201,150,58,0.08) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 20% 80%, rgba(201,150,58,0.04) 0%, transparent 60%);}
.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;position:relative;z-index:1;}
.hero-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border:1px solid var(--gold);border-radius:100px;font-size:11.5px;font-weight:600;color:var(--gold);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:20px;background:var(--gold-pale);}
.hero h1{font-family:'Cormorant Garamond',serif;font-size:62px;font-weight:300;line-height:1.08;letter-spacing:-1px;color:var(--cream);margin-bottom:18px;}
.hero h1 strong{font-weight:700;color:var(--gold);}
.hero p{font-size:15.5px;color:var(--muted);line-height:1.7;max-width:440px;margin-bottom:32px;}
.hero-search-box{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:6px 6px 6px 18px;display:flex;align-items:center;gap:10px;max-width:520px;}
.hero-search-box input{flex:1;background:none;border:none;color:var(--white);font-size:15px;outline:none;padding:8px 0;}
.hero-search-box input::placeholder{color:var(--muted);}
.hero-search-box select{background:var(--surface2);border:1px solid var(--border);color:var(--muted);padding:8px 12px;border-radius:8px;font-size:13px;outline:none;}
.hero-stats{display:flex;gap:32px;margin-top:36px;}
.stat{border-left:2px solid var(--gold);padding-left:14px;}
.stat-num{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:700;color:var(--gold);}
.stat-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-top:2px;}
.hero-visual{position:relative;}
.hero-cards{display:grid;gap:12px;}
.hero-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:18px;display:flex;gap:14px;align-items:center;transition:all 0.3s;}
.hero-card:hover{border-color:var(--gold);transform:translateX(6px);}
.hero-card-icon{width:52px;height:52px;border-radius:12px;background:var(--gold-pale);border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;}
.hero-card-info{flex:1;}
.hero-card-price{font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--gold);}
.hero-card-title{font-size:13px;color:var(--white);margin:2px 0;}
.hero-card-meta{font-size:11.5px;color:var(--muted);}

/* CATEGORIES */
.section{padding:60px 0;}
.section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:28px;}
.section-title{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;color:var(--cream);letter-spacing:-0.5px;}
.section-title span{color:var(--gold);font-weight:600;}
.section-subtitle{font-size:13px;color:var(--muted);margin-top:4px;}
.view-all{font-size:13px;color:var(--gold);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:5px;font-weight:500;padding:8px 0;}
.view-all:hover{color:var(--gold-light);}

.cats-scroll{display:grid;grid-template-columns:repeat(8,1fr);gap:12px;}
.cat-tile{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:22px 10px 16px;text-align:center;cursor:pointer;transition:all 0.25s;position:relative;overflow:hidden;}
.cat-tile::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--gold-pale),transparent);opacity:0;transition:opacity 0.25s;}
.cat-tile:hover{border-color:var(--gold);transform:translateY(-4px);box-shadow:0 16px 40px rgba(201,150,58,0.12);}
.cat-tile:hover::before{opacity:1;}
.cat-emoji{font-size:30px;margin-bottom:10px;display:block;}
.cat-name{font-size:11.5px;font-weight:600;color:var(--muted);letter-spacing:0.8px;text-transform:uppercase;}
.cat-count{font-size:11px;color:var(--gold);margin-top:4px;}

/* LISTINGS GRID */
.listings-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:20px;}
.listing-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;cursor:pointer;transition:all 0.28s;position:relative;}
.listing-card:hover{border-color:var(--gold);transform:translateY(-5px);box-shadow:0 20px 48px rgba(0,0,0,0.4),0 0 0 1px rgba(201,150,58,0.15);}
.listing-img{height:190px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:var(--surface2);}
.listing-img img{width:100%;height:100%;object-fit:cover;}
.listing-img-placeholder{font-size:60px;}
.listing-badge{position:absolute;top:12px;left:12px;background:var(--gold);color:#06060A;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.5px;text-transform:uppercase;}
.listing-badge.new{background:var(--success);color:#fff;}
.listing-badge.hot{background:var(--danger);color:#fff;}
.save-btn{position:absolute;top:10px;right:10px;width:30px;height:30px;border-radius:50%;background:rgba(6,6,10,0.7);border:1px solid var(--border);color:var(--muted);font-size:14px;display:flex;align-items:center;justify-content:center;transition:all 0.2s;backdrop-filter:blur(8px);}
.save-btn:hover,.save-btn.saved{color:#E05555;border-color:#E05555;}
.listing-body{padding:16px;}
.listing-price{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;color:var(--gold);}
.listing-title{font-size:14px;font-weight:500;color:var(--white);margin:5px 0 4px;line-height:1.35;}
.listing-loc{font-size:12px;color:var(--muted);display:flex;align-items:center;gap:4px;margin-bottom:10px;}
.listing-seller{display:flex;align-items:center;gap:8px;padding-top:10px;border-top:1px solid var(--border);}
.listing-seller-av{width:26px;height:26px;border-radius:50%;background:var(--gold-pale);border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--gold);}
.listing-seller-name{font-size:12px;color:var(--muted);}
.listing-seller-time{font-size:11px;color:var(--muted);margin-left:auto;}
.stars{color:var(--gold);font-size:11px;letter-spacing:-1px;}

/* BROWSE PAGE */
.browse-layout{display:grid;grid-template-columns:280px 1fr;gap:24px;padding:32px 0;}
.filters-sidebar{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:24px;position:sticky;top:84px;height:fit-content;max-height:calc(100vh - 100px);overflow-y:auto;}
.filters-sidebar h3{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--cream);margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border);}
.filter-section{margin-bottom:22px;}
.filter-section h4{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:10px;}
.filter-input{width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--white);padding:9px 13px;border-radius:8px;font-size:13.5px;outline:none;transition:border-color 0.2s;}
.filter-input:focus{border-color:var(--gold);}
.filter-input::placeholder{color:var(--muted);}
.filter-select{width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--white);padding:9px 13px;border-radius:8px;font-size:13.5px;outline:none;}
.cat-pill{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:13.5px;color:var(--muted);transition:all 0.15s;border:1px solid transparent;}
.cat-pill:hover{background:var(--surface2);color:var(--white);}
.cat-pill.active{background:var(--gold-pale);color:var(--gold);border-color:var(--gold);}
.price-row{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
.results-bar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border);}
.results-count-text{font-size:13px;color:var(--muted);}
.sort-select{background:var(--surface);border:1px solid var(--border);color:var(--white);padding:7px 12px;border-radius:8px;font-size:13px;outline:none;}
.grid-toggle{display:flex;gap:4px;}
.toggle-btn{width:32px;height:32px;background:var(--surface);border:1px solid var(--border);color:var(--muted);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all 0.15s;}
.toggle-btn.active{background:var(--gold-pale);border-color:var(--gold);color:var(--gold);}

/* POST FORM */
.post-container{max-width:760px;margin:0 auto;padding:40px 0 80px;}
.post-header{margin-bottom:36px;}
.post-header h2{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:300;color:var(--cream);letter-spacing:-1px;}
.post-header p{color:var(--muted);font-size:14px;margin-top:6px;}
.form-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:32px;margin-bottom:20px;}
.form-card h3{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;color:var(--cream);margin-bottom:22px;padding-bottom:14px;border-bottom:1px solid var(--border);}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.form-group{display:flex;flex-direction:column;gap:7px;}
.form-group label{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;}
.form-group input,.form-group select,.form-group textarea{background:var(--surface2);border:1px solid var(--border);color:var(--white);padding:11px 14px;border-radius:10px;font-size:14px;outline:none;transition:border-color 0.2s;}
.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--gold);}
.form-group input::placeholder,.form-group textarea::placeholder{color:var(--muted);}
.form-group textarea{resize:vertical;min-height:110px;line-height:1.6;}
.upload-zone{border:2px dashed var(--border);border-radius:12px;padding:36px;text-align:center;cursor:pointer;transition:all 0.2s;position:relative;}
.upload-zone:hover,.upload-zone.drag{border-color:var(--gold);background:var(--gold-pale);}
.upload-zone input{position:absolute;inset:0;opacity:0;cursor:pointer;}
.upload-icon{font-size:40px;margin-bottom:12px;}
.upload-text{font-size:14px;color:var(--muted);line-height:1.6;}
.upload-text strong{color:var(--gold);}
.img-previews{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;}
.img-preview{width:90px;height:90px;border-radius:10px;object-fit:cover;border:2px solid var(--border);position:relative;}
.img-preview-wrap{position:relative;display:inline-block;}
.img-remove{position:absolute;top:-6px;right:-6px;width:20px;height:20px;background:var(--danger);border-radius:50%;border:none;color:#fff;font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;}
.step-indicator{display:flex;gap:8px;margin-bottom:28px;}
.step{flex:1;height:3px;border-radius:2px;background:var(--border);transition:background 0.3s;}
.step.done{background:var(--gold);}

/* DETAIL MODAL */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:300;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(6px);}
.detail-modal{background:var(--surface);border:1px solid var(--border);border-radius:24px;width:100%;max-width:800px;max-height:90vh;overflow-y:auto;position:relative;animation:scaleIn 0.25s ease;}
.detail-close{position:absolute;top:16px;right:16px;width:36px;height:36px;border-radius:50%;background:var(--surface2);border:1px solid var(--border);color:var(--muted);font-size:18px;display:flex;align-items:center;justify-content:center;z-index:10;}
.detail-close:hover{color:var(--white);border-color:var(--gold);}
.detail-gallery{height:320px;background:var(--surface2);border-radius:20px 20px 0 0;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;}
.detail-gallery img{width:100%;height:100%;object-fit:cover;}
.detail-gallery-placeholder{font-size:100px;}
.detail-body{padding:28px;}
.detail-top{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:start;margin-bottom:20px;}
.detail-price{font-family:'Cormorant Garamond',serif;font-size:38px;font-weight:700;color:var(--gold);line-height:1;}
.detail-title{font-size:22px;font-weight:600;color:var(--white);margin:6px 0 4px;}
.detail-meta-row{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;}
.detail-chip{background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:5px 12px;font-size:12px;color:var(--muted);display:flex;align-items:center;gap:5px;}
.detail-section{margin-bottom:22px;}
.detail-section h4{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:8px;}
.detail-desc{font-size:14px;line-height:1.75;color:var(--white);background:var(--surface2);border-radius:12px;padding:16px;}
.seller-card{background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:18px;display:flex;gap:14px;align-items:center;margin-bottom:22px;}
.seller-av-lg{width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-light));display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#06060A;flex-shrink:0;}
.seller-info{flex:1;}
.seller-name-lg{font-size:16px;font-weight:600;color:var(--white);}
.seller-stats{font-size:12px;color:var(--muted);margin-top:3px;}
.seller-verified{background:rgba(61,189,138,0.15);border:1px solid var(--success);color:var(--success);font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;text-transform:uppercase;letter-spacing:0.5px;display:inline-flex;align-items:center;gap:4px;margin-top:5px;}
.detail-actions{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.btn-lg{padding:14px 24px;font-size:15px;border-radius:12px;font-weight:600;}

/* CHAT */
.chat-page{display:grid;grid-template-columns:320px 1fr;height:calc(100vh - 64px);}
.chat-list{border-right:1px solid var(--border);overflow-y:auto;background:var(--surface);}
.chat-list-header{padding:22px 20px 16px;border-bottom:1px solid var(--border);font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:600;color:var(--cream);}
.chat-item{padding:14px 20px;cursor:pointer;border-bottom:1px solid rgba(40,40,46,0.5);transition:background 0.15s;display:flex;gap:12px;align-items:center;}
.chat-item:hover{background:var(--surface2);}
.chat-item.active{background:var(--gold-pale);border-right:2px solid var(--gold);}
.chat-item-av{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-light));display:flex;align-items:center;justify-content:center;font-weight:700;color:#06060A;font-size:15px;flex-shrink:0;}
.chat-item-info{flex:1;min-width:0;}
.chat-item-name{font-size:14px;font-weight:600;color:var(--white);}
.chat-item-preview{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;}
.chat-item-time{font-size:11px;color:var(--muted);}
.chat-window{display:flex;flex-direction:column;background:var(--bg);}
.chat-window-header{padding:16px 24px;border-bottom:1px solid var(--border);background:var(--surface);display:flex;align-items:center;gap:14px;}
.chat-messages{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:14px;}
.msg-wrap{display:flex;gap:10px;align-items:flex-end;}
.msg-wrap.me{flex-direction:row-reverse;}
.msg-av{width:30px;height:30px;border-radius:50%;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--gold);flex-shrink:0;}
.msg-bubble{max-width:68%;padding:11px 15px;border-radius:18px;font-size:13.5px;line-height:1.5;}
.msg-wrap.them .msg-bubble{background:var(--surface);color:var(--white);border-bottom-left-radius:4px;}
.msg-wrap.me .msg-bubble{background:linear-gradient(135deg,var(--gold),var(--gold-light));color:#06060A;font-weight:500;border-bottom-right-radius:4px;}
.msg-time{font-size:10.5px;color:var(--muted);margin-top:3px;}
.msg-wrap.me .msg-time{text-align:right;}
.chat-input-bar{padding:16px 24px;border-top:1px solid var(--border);background:var(--surface);display:flex;gap:10px;align-items:center;}
.chat-input-bar input{flex:1;background:var(--surface2);border:1px solid var(--border);color:var(--white);padding:11px 16px;border-radius:30px;font-size:14px;outline:none;transition:border-color 0.2s;}
.chat-input-bar input:focus{border-color:var(--gold);}
.chat-input-bar input::placeholder{color:var(--muted);}
.send-btn{width:42px;height:42px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;color:#06060A;font-size:18px;display:flex;align-items:center;justify-content:center;}
.chat-empty{flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:var(--muted);}
.chat-empty-icon{font-size:52px;opacity:0.3;}

/* AUTH MODAL */
.auth-modal{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:40px;width:100%;max-width:440px;position:relative;animation:scaleIn 0.25s ease;}
.auth-modal h2{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--cream);margin-bottom:4px;}
.auth-modal p{font-size:13.5px;color:var(--muted);margin-bottom:28px;}
.auth-switch{text-align:center;font-size:13.5px;color:var(--muted);margin-top:20px;}
.auth-switch span{color:var(--gold);cursor:pointer;font-weight:600;}
.auth-modal .form-group{margin-bottom:16px;}
.modal-close-btn{position:absolute;top:14px;right:14px;background:var(--surface2);border:1px solid var(--border);color:var(--muted);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;}

/* PAYMENT MODAL */
.pay-modal{background:var(--surface);border:1px solid var(--border);border-radius:24px;padding:36px;width:100%;max-width:480px;animation:scaleIn 0.25s ease;}
.pay-modal h2{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:600;color:var(--cream);margin-bottom:6px;}
.pay-summary{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:24px;}
.pay-row{display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:6px;color:var(--muted);}
.pay-row.total{color:var(--white);font-weight:700;font-size:15px;border-top:1px solid var(--border);padding-top:10px;margin-top:4px;}
.pay-methods{display:flex;flex-direction:column;gap:10px;margin-bottom:22px;}
.pay-method{border:1.5px solid var(--border);border-radius:12px;padding:14px 16px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:all 0.2s;}
.pay-method:hover{border-color:var(--gold);}
.pay-method.selected{border-color:var(--gold);background:var(--gold-pale);}
.pay-method-icon{font-size:22px;}
.pay-method-info{flex:1;}
.pay-method-name{font-size:14px;font-weight:600;color:var(--white);}
.pay-method-desc{font-size:12px;color:var(--muted);}
.pay-check{width:20px;height:20px;border-radius:50%;border:2px solid var(--border);margin-left:auto;transition:all 0.2s;}
.pay-method.selected .pay-check{background:var(--gold);border-color:var(--gold);}
.pay-input-group{margin-bottom:14px;}
.pay-input-group label{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.8px;color:var(--muted);display:block;margin-bottom:6px;}
.pay-input-group input{width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--white);padding:11px 14px;border-radius:10px;font-size:14px;outline:none;}
.pay-input-group input:focus{border-color:var(--gold);}
.pay-success{text-align:center;padding:20px 0;}
.pay-success-icon{font-size:64px;margin-bottom:16px;animation:scaleIn 0.4s ease;}

/* PROFILE PAGE */
.profile-header{background:var(--surface);border-bottom:1px solid var(--border);padding:48px 0 32px;}
.profile-hero{display:flex;gap:28px;align-items:flex-end;}
.profile-av-xl{width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--gold-light));display:flex;align-items:center;justify-content:center;font-size:36px;font-weight:700;color:#06060A;border:3px solid var(--gold);box-shadow:0 0 0 6px var(--gold-pale);}
.profile-info h2{font-family:'Cormorant Garamond',serif;font-size:34px;font-weight:600;color:var(--cream);}
.profile-meta{font-size:13px;color:var(--muted);margin-top:5px;}
.profile-stats{display:flex;gap:28px;margin-top:16px;}
.p-stat{text-align:center;}
.p-stat-num{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;color:var(--gold);}
.p-stat-lbl{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:0.8px;}

/* ADMIN */
.admin-page{padding:32px 0 80px;}
.admin-header{margin-bottom:32px;}
.admin-header h2{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:300;color:var(--cream);}
.admin-header p{color:var(--muted);font-size:14px;margin-top:4px;}
.data-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px;}
.data-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:22px;}
.data-card-label{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);margin-bottom:8px;}
.data-card-value{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;color:var(--gold);}
.data-card-change{font-size:12px;color:var(--success);margin-top:4px;}
.data-table-wrap{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-bottom:24px;}
.data-table-header{padding:18px 22px;border-bottom:1px solid var(--border);font-family:'Cormorant Garamond',serif;font-size:20px;font-weight:600;color:var(--cream);display:flex;align-items:center;justify-content:space-between;}
.data-table{width:100%;border-collapse:collapse;}
.data-table th{padding:12px 18px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);border-bottom:1px solid var(--border);}
.data-table td{padding:13px 18px;font-size:13px;color:var(--white);border-bottom:1px solid rgba(40,40,46,0.5);}
.data-table tr:last-child td{border-bottom:none;}
.data-table tr:hover td{background:var(--surface2);}
.status-pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;}
.status-active{background:rgba(61,189,138,0.12);color:var(--success);}
.status-pending{background:rgba(201,150,58,0.12);color:var(--gold);}

/* TOAST */
.toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--surface);border:1px solid var(--gold);color:var(--white);padding:13px 24px;border-radius:40px;font-size:14px;font-weight:500;z-index:999;white-space:nowrap;box-shadow:0 8px 32px rgba(0,0,0,0.5);animation:toastIn 0.3s ease;}

/* EMPTY STATE */
.empty{text-align:center;padding:80px 24px;color:var(--muted);}
.empty-icon{font-size:52px;margin-bottom:16px;opacity:0.4;}
.empty h3{font-family:'Cormorant Garamond',serif;font-size:26px;color:var(--cream);margin-bottom:8px;}

/* UTILITY */
.divider{height:1px;background:var(--border);margin:24px 0;}
.tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:11.5px;font-weight:600;background:var(--gold-pale);color:var(--gold);border:1px solid rgba(201,150,58,0.3);}
.loader{width:28px;height:28px;border:3px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin 0.8s linear infinite;}
.gold-line{height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-light),transparent);border-radius:2px;margin-bottom:28px;}
.scroll-top-btn{position:fixed;bottom:28px;right:28px;width:44px;height:44px;border-radius:50%;background:var(--gold);color:#06060A;border:none;font-size:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(201,150,58,0.4);z-index:90;transition:all 0.2s;}
.scroll-top-btn:hover{transform:translateY(-3px);}
.footer{background:var(--surface);border-top:1px solid var(--border);padding:48px 0 28px;margin-top:60px;}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:40px;}
.footer-brand p{font-size:13.5px;color:var(--muted);line-height:1.7;margin-top:12px;max-width:280px;}
.footer-col h4{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:var(--cream);margin-bottom:14px;}
.footer-col a{display:block;font-size:13px;color:var(--muted);margin-bottom:9px;cursor:pointer;transition:color 0.15s;}
.footer-col a:hover{color:var(--gold);}
.footer-bottom{border-top:1px solid var(--border);padding-top:20px;display:flex;justify-content:space-between;align-items:center;}
.footer-bottom p{font-size:12px;color:var(--muted);}
`;

/* ─── DATA ────────────────────────────────────────────────────── */
const CATS = [
  {id:"all",label:"All",icon:"🌐",count:"10k+"},
  {id:"vehicles",label:"Vehicles",icon:"🚗",count:"2.1k"},
  {id:"property",label:"Property",icon:"🏠",count:"3.4k"},
  {id:"electronics",label:"Electronics",icon:"📱",count:"5.2k"},
  {id:"furniture",label:"Furniture",icon:"🛋️",count:"890"},
  {id:"fashion",label:"Fashion",icon:"👗",count:"4.1k"},
  {id:"jobs",label:"Jobs",icon:"💼",count:"1.3k"},
  {id:"services",label:"Services",icon:"🔧",count:"760"},
  {id:"sports",label:"Sports",icon:"⚽",count:"540"},
];

const CITIES = ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata","Pune","Ahmedabad","Jaipur","Surat","Lucknow","Kanpur","Nagpur","Indore","Bhopal","Patna","Vadodara","Ludhiana","Agra","Nashik"];

const SEED_USERS = [
  {id:"u1",name:"Arjun Mehta",email:"arjun@email.com",password:"demo123",city:"Mumbai",phone:"9876543210",bio:"Trusted seller since 2021. Specializing in electronics.",joinedAt:"2021-03-15",listings:3,sales:28,rating:4.8,verified:true},
  {id:"u2",name:"Priya Sharma",email:"priya@email.com",password:"demo123",city:"Delhi",phone:"9812345678",bio:"Fashion enthusiast selling branded items.",joinedAt:"2022-06-20",listings:5,sales:41,rating:4.9,verified:true},
  {id:"u3",name:"Rohit Kumar",email:"rohit@email.com",password:"demo123",city:"Bangalore",phone:"9898765432",bio:"Car dealer with 10 years experience.",joinedAt:"2020-01-10",listings:8,sales:65,rating:4.7,verified:true},
];

const SEED_LISTINGS = [
  {id:"l1",title:"iPhone 15 Pro Max 256GB Natural Titanium",price:125000,category:"electronics",city:"Mumbai",condition:"Used - Like New",description:"Purchased 3 months ago, pristine condition. Comes with original box, charger, and Apple Care+. No scratches whatsoever. Face ID works perfectly.",sellerId:"u1",sellerName:"Arjun Mehta",image:null,emoji:"📱",saved:false,views:284,createdAt:"2024-01-10",featured:true},
  {id:"l2",title:"BMW 5 Series 530d M Sport 2022",price:5200000,category:"vehicles",city:"Delhi",condition:"Used - Good",description:"Single owner. 28,000 km driven. All service records available. Sunroof, leather interior, 360 camera. No accidents.",sellerId:"u3",sellerName:"Rohit Kumar",image:null,emoji:"🚗",saved:false,views:521,createdAt:"2024-01-12",featured:true},
  {id:"l3",title:"3BHK Sea-facing Apartment Bandra West",price:85000,category:"property",city:"Mumbai",condition:"N/A",description:"Fully furnished luxury apartment with panoramic sea view. 2200 sqft. Gym, pool, 24/7 security. Prime Bandra location.",sellerId:"u2",sellerName:"Priya Sharma",image:null,emoji:"🏠",saved:false,views:1203,createdAt:"2024-01-08",featured:true},
  {id:"l4",title:"MacBook Pro M3 Max 16\" 64GB RAM",price:285000,category:"electronics",city:"Bangalore",condition:"Used - Like New",description:"6 months old M3 Max MacBook Pro. 64GB RAM, 1TB SSD. Original accessories included. AppleCare+ valid.",sellerId:"u1",sellerName:"Arjun Mehta",image:null,emoji:"💻",saved:false,views:387,createdAt:"2024-01-14"},
  {id:"l5",title:"Royal Enfield Himalayan 450 2024",price:235000,category:"vehicles",city:"Pune",condition:"New",description:"Brand new, 0 km. Just registered. Riding gear included. First owner. Ready to ride Leh.",sellerId:"u3",sellerName:"Rohit Kumar",image:null,emoji:"🏍️",saved:false,views:628,createdAt:"2024-01-15"},
  {id:"l6",title:"Louis Vuitton Neverfull MM Authentic",price:95000,category:"fashion",city:"Delhi",condition:"Used - Like New",description:"100% authentic with original receipt and dust bag. Purchased from LV Delhi store. Barely used. Monogram canvas, no wear.",sellerId:"u2",sellerName:"Priya Sharma",image:null,emoji:"👜",saved:false,views:891,createdAt:"2024-01-11"},
  {id:"l7",title:"Sony 65\" OLED 4K Smart TV A95K",price:185000,category:"electronics",city:"Hyderabad",condition:"Used - Good",description:"1 year old Sony A95K QD-OLED. Perfect picture, Dolby Atmos. All cables included. Reason: upgrading to projector.",sellerId:"u1",sellerName:"Arjun Mehta",image:null,emoji:"📺",saved:false,views:312,createdAt:"2024-01-09"},
  {id:"l8",title:"Senior Full-Stack Developer — Remote",price:180000,category:"jobs",city:"Bangalore",condition:"N/A",description:"Series B startup hiring senior engineers. React/Node/AWS. 5+ years experience required. Equity + ESOP + performance bonus.",sellerId:"u2",sellerName:"Priya Sharma",image:null,emoji:"💼",saved:false,views:2140,createdAt:"2024-01-13"},
];

const SEED_CHATS = [
  {id:"c1",listingId:"l1",listingTitle:"iPhone 15 Pro Max",buyerId:"u2",sellerId:"u1",buyerName:"Priya Sharma",sellerName:"Arjun Mehta",messages:[
    {from:"u2",text:"Hi! Is the iPhone still available?",time:"10:30 AM"},
    {from:"u1",text:"Yes absolutely! Great condition. Interested in meeting?",time:"10:32 AM"},
    {from:"u2",text:"Can you do ₹1,20,000? Final price?",time:"10:40 AM"},
    {from:"u1",text:"Best I can do is ₹1,22,000. It has AppleCare+ worth ₹15k.",time:"10:42 AM"},
  ],lastMsg:"Best I can do is ₹1,22,000.",lastTime:"10:42 AM"},
];

const fmtPrice = (p) => {
  if(p>=10000000) return `₹${(p/10000000).toFixed(1)}Cr`;
  if(p>=100000) return `₹${(p/100000).toFixed(2)}L`;
  return `₹${p.toLocaleString("en-IN")}`;
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const d = Math.floor(diff/86400000);
  if(d===0) return "Today";
  if(d===1) return "Yesterday";
  if(d<7) return `${d} days ago`;
  return new Date(dateStr).toLocaleDateString("en-IN",{day:"numeric",month:"short"});
};

/* ─── MAIN APP ────────────────────────────────────────────────── */
export default function App() {
  const [users, setUsers] = useState(SEED_USERS);
  const [listings, setListings] = useState(SEED_LISTINGS);
  const [chats, setChats] = useState(SEED_CHATS);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("home");
  const [prevPage, setPrevPage] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showDetail, setShowDetail] = useState(null);
  const [showPayment, setShowPayment] = useState(null);
  const [showProfile, setShowProfile] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterCity, setFilterCity] = useState("");
  const [filterMin, setFilterMin] = useState("");
  const [filterMax, setFilterMax] = useState("");
  const [filterCond, setFilterCond] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [gridMode, setGridMode] = useState("grid");
  const [toast, setToast] = useState(null);
  const [savedIds, setSavedIds] = useState([]);
  const [payStep, setPayStep] = useState(1);
  const [payMethod, setPayMethod] = useState("upi");
  const [payFields, setPayFields] = useState({upi:"",card:"",cvv:"",expiry:"",name:"",wallet:""});
  const [postData, setPostData] = useState({title:"",price:"",category:"",city:"",condition:"Used - Good",description:"",phone:"",images:[]});
  const [authData, setAuthData] = useState({name:"",email:"",password:"",city:"",phone:""});
  const [chatMsg, setChatMsg] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // PERSISTENT STORAGE LOAD
  useEffect(() => {
    const load = async () => {
      try {
        const u = await window.storage.get("hos_users");
        if(u) setUsers(JSON.parse(u.value));
        const l = await window.storage.get("hos_listings");
        if(l) setListings(JSON.parse(l.value));
        const c = await window.storage.get("hos_chats");
        if(c) setChats(JSON.parse(c.value));
        const s = await window.storage.get("hos_saved");
        if(s) setSavedIds(JSON.parse(s.value));
        const cu = await window.storage.get("hos_session");
        if(cu) setCurrentUser(JSON.parse(cu.value));
      } catch(e) {}
      setDataLoaded(true);
    };
    load();
  }, []);

  // PERSIST ON CHANGE
  useEffect(() => { if(dataLoaded) window.storage.set("hos_users", JSON.stringify(users)).catch(()=>{}); }, [users, dataLoaded]);
  useEffect(() => { if(dataLoaded) window.storage.set("hos_listings", JSON.stringify(listings)).catch(()=>{}); }, [listings, dataLoaded]);
  useEffect(() => { if(dataLoaded) window.storage.set("hos_chats", JSON.stringify(chats)).catch(()=>{}); }, [chats, dataLoaded]);
  useEffect(() => { if(dataLoaded) window.storage.set("hos_saved", JSON.stringify(savedIds)).catch(()=>{}); }, [savedIds, dataLoaded]);
  useEffect(() => { if(dataLoaded) { if(currentUser) window.storage.set("hos_session", JSON.stringify(currentUser)).catch(()=>{}); else window.storage.delete("hos_session").catch(()=>{}); } }, [currentUser, dataLoaded]);

  useEffect(() => { if(chatEndRef.current) chatEndRef.current.scrollIntoView({behavior:"smooth"}); }, [activeChat, chats]);

  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(null), 3000); };
  const nav = (p) => { setPrevPage(page); setPage(p); window.scrollTo(0,0); };

  const handleAuth = () => {
    if(authMode==="login") {
      const u = users.find(x => x.email===authData.email && x.password===authData.password);
      if(!u) { showToast("❌ Invalid email or password"); return; }
      setCurrentUser(u); setShowAuth(false); showToast(`Welcome back, ${u.name.split(" ")[0]}! 👋`);
    } else {
      if(!authData.name||!authData.email||!authData.password) { showToast("Please fill all fields"); return; }
      if(users.find(x=>x.email===authData.email)) { showToast("Email already registered"); return; }
      const nu = {id:`u${Date.now()}`,name:authData.name,email:authData.email,password:authData.password,city:authData.city||"",phone:authData.phone||"",bio:"",joinedAt:new Date().toISOString().split("T")[0],listings:0,sales:0,rating:0,verified:false};
      setUsers(p=>[...p,nu]); setCurrentUser(nu); setShowAuth(false);
      showToast(`Welcome to HouseOfShivisha, ${nu.name.split(" ")[0]}! 🎉`);
    }
    setAuthData({name:"",email:"",password:"",city:"",phone:""});
  };

  const handlePost = () => {
    if(!currentUser) { setShowAuth(true); return; }
    if(!postData.title||!postData.price||!postData.category||!postData.city) { showToast("Please fill all required fields"); return; }
    const nl = {id:`l${Date.now()}`,title:postData.title,price:Number(postData.price),category:postData.category,city:postData.city,condition:postData.condition,description:postData.description,phone:postData.phone,sellerId:currentUser.id,sellerName:currentUser.name,images:postData.images,emoji:CATS.find(c=>c.id===postData.category)?.icon||"📦",saved:false,views:0,createdAt:new Date().toISOString().split("T")[0],featured:false};
    setListings(p=>[nl,...p]);
    setUsers(p=>p.map(u=>u.id===currentUser.id?{...u,listings:u.listings+1}:u));
    setPostData({title:"",price:"",category:"",city:"",condition:"Used - Good",description:"",phone:"",images:[]});
    nav("browse"); showToast("✅ Your listing is live!");
  };

  const handleImageUpload = (files) => {
    Array.from(files).slice(0,6-postData.images.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => setPostData(p=>({...p,images:[...p.images,e.target.result]}));
      reader.readAsDataURL(file);
    });
  };

  const toggleSave = (id) => {
    if(!currentUser) { setShowAuth(true); return; }
    setSavedIds(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
    showToast(savedIds.includes(id) ? "Removed from saved" : "❤️ Saved!");
  };

  const startChat = (listing) => {
    if(!currentUser) { setShowAuth(true); return; }
    if(listing.sellerId===currentUser.id) { showToast("This is your own listing"); return; }
    const existing = chats.find(c=>c.listingId===listing.id && c.buyerId===currentUser.id);
    if(existing) { setActiveChat(existing.id); nav("chat"); setShowDetail(null); return; }
    const nc = {id:`c${Date.now()}`,listingId:listing.id,listingTitle:listing.title,buyerId:currentUser.id,sellerId:listing.sellerId,buyerName:currentUser.name,sellerName:listing.sellerName,messages:[],lastMsg:"",lastTime:""};
    setChats(p=>[...p,nc]); setActiveChat(nc.id); nav("chat"); setShowDetail(null);
  };

  const sendMsg = () => {
    if(!chatMsg.trim()||!activeChat) return;
    const now = new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    setChats(p=>p.map(c=>c.id===activeChat?{...c,messages:[...c.messages,{from:currentUser.id,text:chatMsg,time:now}],lastMsg:chatMsg,lastTime:now}:c));
    setChatMsg("");
  };

  const handlePayment = () => {
    setPayStep(2);
    setTimeout(()=>{
      setPayStep(3);
      const listing = showPayment;
      setListings(p=>p.map(l=>l.id===listing.id?{...l,sold:true}:l));
      setUsers(p=>p.map(u=>u.id===listing.sellerId?{...u,sales:u.sales+1}:u));
      setTimeout(()=>{ setShowPayment(null); setPayStep(1); showToast("🎉 Payment successful! Seller will contact you."); },2000);
    },2000);
  };

  const viewListing = (l) => {
    setListings(p=>p.map(x=>x.id===l.id?{...x,views:x.views+1}:x));
    setShowDetail(l);
  };

  // FILTERED LISTINGS
  const filtered = listings.filter(l => {
    const q = searchQuery.toLowerCase();
    const mQ = !q || l.title.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q);
    const mCat = filterCat==="all" || l.category===filterCat;
    const mCity = !filterCity || l.city.toLowerCase().includes(filterCity.toLowerCase());
    const mMin = !filterMin || l.price >= Number(filterMin);
    const mMax = !filterMax || l.price <= Number(filterMax);
    const mCond = !filterCond || l.condition===filterCond;
    return mQ && mCat && mCity && mMin && mMax && mCond;
  }).sort((a,b)=>{
    if(sortBy==="newest") return new Date(b.createdAt)-new Date(a.createdAt);
    if(sortBy==="price_asc") return a.price-b.price;
    if(sortBy==="price_desc") return b.price-a.price;
    if(sortBy==="popular") return b.views-a.views;
    return 0;
  });

  const myChats = chats.filter(c => currentUser && (c.buyerId===currentUser.id || c.sellerId===currentUser.id));
  const sellerOf = (id) => users.find(u=>u.id===id);
  const currentChatObj = chats.find(c=>c.id===activeChat);
  const otherUser = (chat) => {
    if(!currentUser) return null;
    const otherId = chat.buyerId===currentUser.id ? chat.sellerId : chat.buyerId;
    return users.find(u=>u.id===otherId);
  };

  const ListingCard = ({l}) => (
    <div className="listing-card" style={{opacity:l.sold?0.6:1}} onClick={()=>viewListing(l)}>
      <div className="listing-img">
        {l.images&&l.images[0] ? <img src={l.images[0]} alt={l.title}/> : <span className="listing-img-placeholder">{l.emoji}</span>}
        {l.featured && <span className="listing-badge">Featured</span>}
        {l.condition==="New" && !l.featured && <span className="listing-badge new">New</span>}
        {l.sold && <span className="listing-badge" style={{background:"var(--muted)"}}>Sold</span>}
        <button className={`save-btn ${savedIds.includes(l.id)?"saved":""}`} onClick={e=>{e.stopPropagation();toggleSave(l.id);}}>
          {savedIds.includes(l.id)?"❤️":"🤍"}
        </button>
      </div>
      <div className="listing-body">
        <div className="listing-price">{fmtPrice(l.price)}{l.category==="jobs"&&"/mo"}</div>
        <div className="listing-title">{l.title}</div>
        <div className="listing-loc">📍 {l.city} &nbsp;·&nbsp; 👁 {l.views} views</div>
        <div className="listing-seller">
          <div className="listing-seller-av">{l.sellerName[0]}</div>
          <div className="listing-seller-name">{l.sellerName}</div>
          <div className="listing-seller-time">{timeAgo(l.createdAt)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{G}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="logo" onClick={()=>nav("home")}>House<em>Of</em>Shivisha</div>
          <div className="nav-search-wrap">
            <span className="nav-search-icon">🔍</span>
            <input placeholder="Search listings, brands, cities..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setFilterCat("all");nav("browse");}}} />
          </div>
          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={()=>nav("browse")}>Browse</button>
            <button className="btn btn-ghost" onClick={()=>{if(!currentUser){setShowAuth(true);}else{nav("chat");}}}>
              Messages {currentUser&&myChats.length>0&&<span className="badge-count">{myChats.length}</span>}
            </button>
            {currentUser ? (
              <>
                <button className="btn btn-outline" onClick={()=>nav("post")}>+ Post Ad</button>
                <div className="avatar" onClick={()=>nav("profile")} title={currentUser.name}>{currentUser.name[0]}</div>
                {currentUser.email==="admin@hos.com" && <button className="btn btn-ghost" onClick={()=>nav("admin")} style={{color:"var(--gold)"}}>⚙️ Admin</button>}
                <button className="btn btn-ghost" style={{color:"var(--muted)",fontSize:12}} onClick={()=>{setCurrentUser(null);nav("home");showToast("Logged out");}}>Logout</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={()=>{setAuthMode("login");setShowAuth(true);}}>Login</button>
                <button className="btn btn-gold" onClick={()=>{setAuthMode("signup");setShowAuth(true);}}>Join Free</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="main">

        {/* ── HOME ───────────────────────────────────────────── */}
        {page==="home" && (
          <>
            <section className="hero">
              <div className="hero-bg"/>
              <div className="container">
                <div className="hero-grid">
                  <div className="fade-up">
                    <div className="hero-tag">✦ India's Premium Marketplace</div>
                    <h1>Buy & Sell<br/><strong>Anything.</strong><br/>Anywhere.</h1>
                    <p>Discover extraordinary deals on vehicles, property, electronics & more. Trusted by millions across India.</p>
                    <div className="hero-search-box">
                      <span style={{fontSize:18,color:"var(--muted)"}}>🔍</span>
                      <input placeholder="What are you looking for?" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){nav("browse");}}}/>
                      <select value={filterCity} onChange={e=>setFilterCity(e.target.value)} className="filter-select" style={{background:"var(--surface2)",border:"1px solid var(--border)",color:"var(--muted)",padding:"8px 12px",borderRadius:8,fontSize:13,outline:"none",maxWidth:130}}>
                        <option value="">All Cities</option>
                        {CITIES.map(c=><option key={c}>{c}</option>)}
                      </select>
                      <button className="btn btn-gold" onClick={()=>nav("browse")} style={{borderRadius:10,padding:"10px 22px"}}>Search</button>
                    </div>
                    <div className="hero-stats">
                      <div className="stat"><div className="stat-num">{listings.length.toLocaleString()}+</div><div className="stat-label">Active Listings</div></div>
                      <div className="stat"><div className="stat-num">{users.length.toLocaleString()}+</div><div className="stat-label">Trusted Users</div></div>
                      <div className="stat"><div className="stat-num">28</div><div className="stat-label">Cities</div></div>
                    </div>
                  </div>
                  <div className="fade-up-2">
                    <div className="hero-cards">
                      {listings.filter(l=>l.featured).slice(0,3).map(l=>(
                        <div key={l.id} className="hero-card" onClick={()=>viewListing(l)}>
                          <div className="hero-card-icon">{l.emoji}</div>
                          <div className="hero-card-info">
                            <div className="hero-card-price">{fmtPrice(l.price)}</div>
                            <div className="hero-card-title">{l.title}</div>
                            <div className="hero-card-meta">📍 {l.city} · {timeAgo(l.createdAt)}</div>
                          </div>
                          <span style={{color:"var(--gold)",fontSize:20}}>›</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="container">
              <section className="section">
                <div className="section-header">
                  <div><div className="section-title">Browse <span>Categories</span></div><div className="section-subtitle">Find exactly what you're looking for</div></div>
                  <button className="view-all" onClick={()=>nav("browse")}>View all listings →</button>
                </div>
                <div className="cats-scroll">
                  {CATS.filter(c=>c.id!=="all").map(c=>(
                    <div key={c.id} className="cat-tile" onClick={()=>{setFilterCat(c.id);nav("browse");}}>
                      <span className="cat-emoji">{c.icon}</span>
                      <div className="cat-name">{c.label}</div>
                      <div className="cat-count">{c.count} ads</div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="gold-line"/>

              <section className="section">
                <div className="section-header">
                  <div><div className="section-title">Featured <span>Listings</span></div><div className="section-subtitle">Hand-picked premium ads</div></div>
                  <button className="view-all" onClick={()=>nav("browse")}>See all →</button>
                </div>
                <div className="listings-grid">
                  {listings.slice(0,8).map(l=><ListingCard key={l.id} l={l}/>)}
                </div>
              </section>

              <section className="section" style={{textAlign:"center",background:"var(--surface)",borderRadius:24,padding:"60px 40px",border:"1px solid var(--border)"}}>
                <div style={{color:"var(--gold)",fontSize:13,letterSpacing:2,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>✦ Sell Smarter</div>
                <div className="section-title" style={{marginBottom:12}}>Have something to sell?</div>
                <p style={{color:"var(--muted)",fontSize:15,maxWidth:500,margin:"0 auto 28px",lineHeight:1.7}}>Post your listing in under 2 minutes and reach millions of buyers across India. Completely free.</p>
                <button className="btn btn-gold btn-lg" onClick={()=>{if(!currentUser){setShowAuth(true);}else{nav("post");}}}>Start Selling →</button>
              </section>
            </div>
          </>
        )}

        {/* ── BROWSE ─────────────────────────────────────────── */}
        {page==="browse" && (
          <div className="container">
            <div className="browse-layout">
              <aside className="filters-sidebar slide-in">
                <h3>Filters</h3>
                <div className="filter-section">
                  <h4>Search</h4>
                  <input className="filter-input" placeholder="Keywords..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
                </div>
                <div className="filter-section">
                  <h4>Category</h4>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {CATS.map(c=>(
                      <div key={c.id} className={`cat-pill ${filterCat===c.id?"active":""}`} onClick={()=>setFilterCat(c.id)}>
                        <span>{c.icon}</span> {c.label}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="filter-section">
                  <h4>City</h4>
                  <select className="filter-select" value={filterCity} onChange={e=>setFilterCity(e.target.value)}>
                    <option value="">All Cities</option>
                    {CITIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="filter-section">
                  <h4>Price Range (₹)</h4>
                  <div className="price-row">
                    <input className="filter-input" type="number" placeholder="Min" value={filterMin} onChange={e=>setFilterMin(e.target.value)}/>
                    <input className="filter-input" type="number" placeholder="Max" value={filterMax} onChange={e=>setFilterMax(e.target.value)}/>
                  </div>
                </div>
                <div className="filter-section">
                  <h4>Condition</h4>
                  <select className="filter-select" value={filterCond} onChange={e=>setFilterCond(e.target.value)}>
                    <option value="">Any condition</option>
                    <option>New</option>
                    <option>Used - Like New</option>
                    <option>Used - Good</option>
                    <option>Used - Fair</option>
                    <option>N/A</option>
                  </select>
                </div>
                <button onClick={()=>{setSearchQuery("");setFilterCat("all");setFilterCity("");setFilterMin("");setFilterMax("");setFilterCond("");}} className="btn" style={{width:"100%",background:"var(--surface2)",color:"var(--muted)",border:"1px solid var(--border)",marginTop:8}}>Clear All Filters</button>
              </aside>

              <div className="fade-up">
                <div className="results-bar">
                  <span className="results-count-text">{filtered.length} listing{filtered.length!==1?"s":""} found</span>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <div className="grid-toggle">
                      <button className={`toggle-btn ${gridMode==="grid"?"active":""}`} onClick={()=>setGridMode("grid")}>⊞</button>
                      <button className={`toggle-btn ${gridMode==="list"?"active":""}`} onClick={()=>setGridMode("list")}>☰</button>
                    </div>
                    <select className="sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                      <option value="newest">Newest First</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="popular">Most Popular</option>
                    </select>
                  </div>
                </div>
                {filtered.length===0 ? (
                  <div className="empty"><div className="empty-icon">🔍</div><h3>No listings found</h3><p style={{marginTop:8}}>Try adjusting your filters or search terms.</p></div>
                ) : (
                  <div className={gridMode==="grid"?"listings-grid":""} style={gridMode==="list"?{display:"flex",flexDirection:"column",gap:12}:{}}>
                    {filtered.map(l => gridMode==="grid" ? <ListingCard key={l.id} l={l}/> : (
                      <div key={l.id} className="listing-card" style={{display:"flex",flexDirection:"row"}} onClick={()=>viewListing(l)}>
                        <div className="listing-img" style={{width:180,height:130,flexShrink:0,borderRadius:"16px 0 0 16px"}}>
                          {l.images&&l.images[0]?<img src={l.images[0]} alt={l.title}/>:<span className="listing-img-placeholder" style={{fontSize:40}}>{l.emoji}</span>}
                        </div>
                        <div className="listing-body" style={{flex:1}}>
                          <div style={{display:"flex",justifyContent:"space-between"}}>
                            <div className="listing-price">{fmtPrice(l.price)}</div>
                            <button className={`save-btn ${savedIds.includes(l.id)?"saved":""}`} style={{position:"relative",top:"unset",right:"unset"}} onClick={e=>{e.stopPropagation();toggleSave(l.id);}}>{savedIds.includes(l.id)?"❤️":"🤍"}</button>
                          </div>
                          <div className="listing-title">{l.title}</div>
                          <div className="listing-loc">📍 {l.city} · {l.condition}</div>
                          <div className="listing-seller" style={{marginTop:8}}>
                            <div className="listing-seller-av">{l.sellerName[0]}</div>
                            <div className="listing-seller-name">{l.sellerName}</div>
                            <div className="listing-seller-time">{timeAgo(l.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── POST AD ────────────────────────────────────────── */}
        {page==="post" && (
          <div className="container">
            <div className="post-container">
              <div className="post-header fade-up">
                <h2>Post Your Ad</h2>
                <p>Reach millions of buyers across India — it's free.</p>
              </div>
              <div className="step-indicator">
                {["Details","Photos","Contact"].map((s,i)=><div key={i} className={`step ${postData.title&&postData.category?i<=1?"done":postData.images.length>0?i<=2?"done":"":i===0?"done":"":i===0?"done":""}`}/>)}
              </div>

              <div className="form-card fade-up-1">
                <h3>📝 Listing Details</h3>
                <div className="form-group" style={{marginBottom:16}}>
                  <label>Ad Title *</label>
                  <input placeholder="e.g. iPhone 15 Pro Max 256GB Pristine Condition" value={postData.title} onChange={e=>setPostData(p=>({...p,title:e.target.value}))}/>
                </div>
                <div className="form-grid" style={{marginBottom:16}}>
                  <div className="form-group">
                    <label>Category *</label>
                    <select value={postData.category} onChange={e=>setPostData(p=>({...p,category:e.target.value}))}>
                      <option value="">Select a category</option>
                      {CATS.filter(c=>c.id!=="all").map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <select value={postData.condition} onChange={e=>setPostData(p=>({...p,condition:e.target.value}))}>
                      <option>New</option><option>Used - Like New</option><option>Used - Good</option><option>Used - Fair</option><option>N/A</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid" style={{marginBottom:16}}>
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input type="number" placeholder="0" value={postData.price} onChange={e=>setPostData(p=>({...p,price:e.target.value}))}/>
                  </div>
                  <div className="form-group">
                    <label>City *</label>
                    <select value={postData.city} onChange={e=>setPostData(p=>({...p,city:e.target.value}))}>
                      <option value="">Select city</option>
                      {CITIES.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea placeholder="Describe your item in detail — condition, features, reason for selling..." value={postData.description} onChange={e=>setPostData(p=>({...p,description:e.target.value}))}/>
                </div>
              </div>

              <div className="form-card fade-up-2">
                <h3>📸 Photos</h3>
                <div className="upload-zone" onDrop={e=>{e.preventDefault();handleImageUpload(e.dataTransfer.files);}} onDragOver={e=>e.preventDefault()}>
                  <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={e=>handleImageUpload(e.target.files)}/>
                  <div className="upload-icon">📷</div>
                  <div className="upload-text"><strong>Click to upload</strong> or drag & drop<br/>PNG, JPG, WEBP — up to 6 images</div>
                </div>
                {postData.images.length>0 && (
                  <div className="img-previews">
                    {postData.images.map((img,i)=>(
                      <div key={i} className="img-preview-wrap">
                        <img src={img} className="img-preview" alt="preview"/>
                        <button className="img-remove" onClick={()=>setPostData(p=>({...p,images:p.images.filter((_,j)=>j!==i)}))} style={{display:"flex"}}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-card fade-up-3">
                <h3>📞 Contact Details</h3>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" value={postData.phone} onChange={e=>setPostData(p=>({...p,phone:e.target.value}))}/>
                </div>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <button className="btn" style={{background:"var(--surface2)",color:"var(--muted)",border:"1px solid var(--border)",padding:"14px",borderRadius:12,fontSize:15}} onClick={()=>nav("browse")}>Cancel</button>
                <button className="btn btn-gold" style={{padding:"14px",borderRadius:12,fontSize:15,fontWeight:700,justifyContent:"center"}} onClick={handlePost}>🚀 Publish Listing</button>
              </div>
            </div>
          </div>
        )}

        {/* ── CHAT ───────────────────────────────────────────── */}
        {page==="chat" && (
          <div className="chat-page">
            <div className="chat-list">
              <div className="chat-list-header">Messages</div>
              {!currentUser ? (
                <div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>
                  <div style={{fontSize:40,marginBottom:12}}>💬</div>
                  <p style={{fontSize:14,marginBottom:16}}>Login to view your messages</p>
                  <button className="btn btn-gold" onClick={()=>setShowAuth(true)}>Login</button>
                </div>
              ) : myChats.length===0 ? (
                <div style={{padding:32,textAlign:"center",color:"var(--muted)"}}>
                  <div style={{fontSize:40,marginBottom:8}}>💬</div>
                  <p style={{fontSize:13}}>No conversations yet.<br/>Click "Chat" on any listing!</p>
                </div>
              ) : myChats.map(c => {
                const other = otherUser(c);
                return (
                  <div key={c.id} className={`chat-item ${activeChat===c.id?"active":""}`} onClick={()=>setActiveChat(c.id)}>
                    <div className="chat-item-av">{other?.name[0]||"?"}</div>
                    <div className="chat-item-info">
                      <div className="chat-item-name">{other?.name||"User"}</div>
                      <div className="chat-item-preview">Re: {c.listingTitle}</div>
                      {c.lastMsg && <div className="chat-item-preview" style={{opacity:0.6}}>{c.lastMsg}</div>}
                    </div>
                    <div className="chat-item-time">{c.lastTime}</div>
                  </div>
                );
              })}
            </div>

            {activeChat && currentChatObj ? (
              <div className="chat-window">
                <div className="chat-window-header">
                  {(() => {
                    const other = otherUser(currentChatObj);
                    return (<>
                      <div className="chat-item-av">{other?.name[0]||"?"}</div>
                      <div>
                        <div style={{fontWeight:600,color:"var(--white)",fontSize:15}}>{other?.name}</div>
                        <div style={{fontSize:12,color:"var(--muted)"}}>Re: {currentChatObj.listingTitle}</div>
                      </div>
                    </>);
                  })()}
                </div>
                <div className="chat-messages">
                  {currentChatObj.messages.length===0 && <div style={{textAlign:"center",color:"var(--muted)",fontSize:13,marginTop:40}}>Say hello! Start the conversation.</div>}
                  {currentChatObj.messages.map((m,i)=>(
                    <div key={i} className={`msg-wrap ${m.from===currentUser?.id?"me":"them"}`}>
                      {m.from!==currentUser?.id && <div className="msg-av">{otherUser(currentChatObj)?.name[0]}</div>}
                      <div>
                        <div className="msg-bubble">{m.text}</div>
                        <div className="msg-time">{m.time}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef}/>
                </div>
                <div className="chat-input-bar">
                  <input placeholder="Type a message..." value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendMsg();}}/>
                  <button className="send-btn" onClick={sendMsg}>➤</button>
                </div>
              </div>
            ) : (
              <div className="chat-empty">
                <div className="chat-empty-icon">💬</div>
                <p style={{fontSize:15,color:"var(--muted)"}}>Select a conversation</p>
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE ────────────────────────────────────────── */}
        {page==="profile" && currentUser && (() => {
          const profileUser = showProfile ? users.find(u=>u.id===showProfile) : currentUser;
          const userListings = listings.filter(l=>l.sellerId===profileUser?.id);
          if(!profileUser) return null;
          return (<>
            <div className="profile-header">
              <div className="container">
                <div className="profile-hero fade-up">
                  <div className="profile-av-xl">{profileUser.name[0]}</div>
                  <div className="profile-info">
                    <h2>{profileUser.name} {profileUser.verified && <span className="seller-verified">✓ Verified</span>}</h2>
                    <div className="profile-meta">📍 {profileUser.city||"India"} &nbsp;·&nbsp; Joined {new Date(profileUser.joinedAt).toLocaleDateString("en-IN",{month:"long",year:"numeric"})}</div>
                    {profileUser.bio && <div style={{fontSize:13.5,color:"var(--muted)",marginTop:8,maxWidth:480}}>{profileUser.bio}</div>}
                    <div className="profile-stats">
                      <div className="p-stat"><div className="p-stat-num">{userListings.length}</div><div className="p-stat-lbl">Listings</div></div>
                      <div className="p-stat"><div className="p-stat-num">{profileUser.sales}</div><div className="p-stat-lbl">Sales</div></div>
                      {profileUser.rating>0 && <div className="p-stat"><div className="p-stat-num">⭐ {profileUser.rating}</div><div className="p-stat-lbl">Rating</div></div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container" style={{paddingTop:36}}>
              <div className="section-title" style={{marginBottom:20}}>Active <span>Listings</span></div>
              {userListings.length===0 ? <div className="empty"><div className="empty-icon">📭</div><h3>No listings yet</h3></div> : (
                <div className="listings-grid">
                  {userListings.map(l=><ListingCard key={l.id} l={l}/>)}
                </div>
              )}
              {profileUser.id===currentUser?.id && (
                <div style={{marginTop:40,background:"var(--surface)",border:"1px solid var(--border)",borderRadius:20,padding:28}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"var(--cream)",marginBottom:20}}>Saved Listings</div>
                  {savedIds.length===0 ? <p style={{color:"var(--muted)",fontSize:14}}>Nothing saved yet. Heart a listing to save it!</p> : (
                    <div className="listings-grid">
                      {listings.filter(l=>savedIds.includes(l.id)).map(l=><ListingCard key={l.id} l={l}/>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>);
        })()}

        {/* ── ADMIN ──────────────────────────────────────────── */}
        {page==="admin" && (
          <div className="container">
            <div className="admin-page fade-up">
              <div className="admin-header">
                <h2>⚙️ Admin Dashboard</h2>
                <p>Real-time data overview — all user and listing activity</p>
              </div>
              <div className="data-cards">
                {[{label:"Total Users",val:users.length,chg:"+12 this week"},{label:"Total Listings",val:listings.length,chg:`+${listings.filter(l=>l.createdAt>="2024-01-10").length} recent`},{label:"Total Chats",val:chats.reduce((a,c)=>a+c.messages.length,0),chg:"Messages sent"},{label:"Saved Items",val:savedIds.length,chg:"Across all users"}].map((d,i)=>(
                  <div key={i} className="data-card">
                    <div className="data-card-label">{d.label}</div>
                    <div className="data-card-value">{d.val}</div>
                    <div className="data-card-change">{d.chg}</div>
                  </div>
                ))}
              </div>

              <div className="data-table-wrap">
                <div className="data-table-header">👥 All Users <span style={{fontSize:13,color:"var(--muted)",fontFamily:"'Jost',sans-serif",fontWeight:400}}>{users.length} total</span></div>
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Email</th><th>City</th><th>Phone</th><th>Joined</th><th>Listings</th><th>Sales</th><th>Status</th></tr></thead>
                  <tbody>{users.map(u=>(
                    <tr key={u.id}>
                      <td style={{fontWeight:600}}>{u.name}</td>
                      <td style={{color:"var(--muted)"}}>{u.email}</td>
                      <td>{u.city||"—"}</td>
                      <td style={{color:"var(--muted)"}}>{u.phone||"—"}</td>
                      <td style={{color:"var(--muted)"}}>{u.joinedAt}</td>
                      <td>{u.listings}</td>
                      <td style={{color:"var(--gold)",fontWeight:600}}>{u.sales}</td>
                      <td><span className={`status-pill ${u.verified?"status-active":"status-pending"}`}>{u.verified?"Verified":"Unverified"}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>

              <div className="data-table-wrap">
                <div className="data-table-header">📋 All Listings <span style={{fontSize:13,color:"var(--muted)",fontFamily:"'Jost',sans-serif",fontWeight:400}}>{listings.length} total</span></div>
                <table className="data-table">
                  <thead><tr><th>Title</th><th>Price</th><th>Category</th><th>City</th><th>Seller</th><th>Views</th><th>Posted</th><th>Status</th></tr></thead>
                  <tbody>{listings.map(l=>(
                    <tr key={l.id}>
                      <td style={{fontWeight:500,maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{l.emoji} {l.title}</td>
                      <td style={{color:"var(--gold)",fontWeight:700}}>{fmtPrice(l.price)}</td>
                      <td>{CATS.find(c=>c.id===l.category)?.label||l.category}</td>
                      <td>{l.city}</td>
                      <td style={{color:"var(--muted)"}}>{l.sellerName}</td>
                      <td>{l.views}</td>
                      <td style={{color:"var(--muted)"}}>{l.createdAt}</td>
                      <td><span className={`status-pill ${l.sold?"status-pending":"status-active"}`}>{l.sold?"Sold":"Active"}</span></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>

              <div className="data-table-wrap">
                <div className="data-table-header">💬 All Messages <span style={{fontSize:13,color:"var(--muted)",fontFamily:"'Jost',sans-serif",fontWeight:400}}>{chats.length} conversations</span></div>
                <table className="data-table">
                  <thead><tr><th>Listing</th><th>Buyer</th><th>Seller</th><th>Messages</th><th>Last Message</th></tr></thead>
                  <tbody>{chats.map(c=>(
                    <tr key={c.id}>
                      <td style={{fontWeight:500}}>{c.listingTitle}</td>
                      <td>{c.buyerName}</td>
                      <td>{c.sellerName}</td>
                      <td style={{color:"var(--gold)",fontWeight:600}}>{c.messages.length}</td>
                      <td style={{color:"var(--muted)",maxWidth:200,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.lastMsg||"—"}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── LISTING DETAIL MODAL ──────────────────────────────── */}
      {showDetail && (
        <div className="overlay" onClick={()=>setShowDetail(null)}>
          <div className="detail-modal" onClick={e=>e.stopPropagation()}>
            <button className="detail-close" onClick={()=>setShowDetail(null)}>×</button>
            <div className="detail-gallery">
              {showDetail.images&&showDetail.images[0] ? <img src={showDetail.images[0]} alt={showDetail.title}/> : <span className="detail-gallery-placeholder">{showDetail.emoji}</span>}
            </div>
            <div className="detail-body">
              <div className="detail-top">
                <div>
                  <div className="detail-price">{fmtPrice(showDetail.price)}{showDetail.category==="jobs"&&"/mo"}</div>
                  <div className="detail-title">{showDetail.title}</div>
                </div>
                <button className={`save-btn ${savedIds.includes(showDetail.id)?"saved":""}`} style={{position:"relative",top:"unset",right:"unset",width:38,height:38,fontSize:18}} onClick={()=>toggleSave(showDetail.id)}>
                  {savedIds.includes(showDetail.id)?"❤️":"🤍"}
                </button>
              </div>
              <div className="detail-meta-row">
                <div className="detail-chip">📍 {showDetail.city}</div>
                <div className="detail-chip">🏷 {showDetail.condition}</div>
                <div className="detail-chip">🕒 {timeAgo(showDetail.createdAt)}</div>
                <div className="detail-chip">👁 {showDetail.views} views</div>
              </div>
              {showDetail.description && (
                <div className="detail-section">
                  <h4>About this listing</h4>
                  <div className="detail-desc">{showDetail.description}</div>
                </div>
              )}
              <div className="detail-section">
                <h4>Seller</h4>
                <div className="seller-card" style={{cursor:"pointer"}} onClick={()=>{setShowProfile(showDetail.sellerId);setShowDetail(null);nav("profile");}}>
                  <div className="seller-av-lg">{showDetail.sellerName[0]}</div>
                  <div className="seller-info">
                    <div className="seller-name-lg">{showDetail.sellerName}</div>
                    <div className="seller-stats">{sellerOf(showDetail.sellerId)?.sales||0} sales · {sellerOf(showDetail.sellerId)?.city||"India"}</div>
                    {sellerOf(showDetail.sellerId)?.verified && <div className="seller-verified">✓ Verified Seller</div>}
                    {sellerOf(showDetail.sellerId)?.rating>0 && <div style={{marginTop:5}}><span className="stars">{"★".repeat(Math.round(sellerOf(showDetail.sellerId)?.rating||0))}</span> <span style={{fontSize:12,color:"var(--muted)"}}>{sellerOf(showDetail.sellerId)?.rating}</span></div>}
                  </div>
                  <span style={{color:"var(--gold)",fontSize:20}}>›</span>
                </div>
              </div>
              {!showDetail.sold && (
                <div className="detail-actions">
                  <button className="btn btn-outline btn-lg" onClick={()=>startChat(showDetail)}>💬 Chat with Seller</button>
                  <button className="btn btn-gold btn-lg" onClick={()=>{setShowPayment(showDetail);setShowDetail(null);}}>💳 Buy Now</button>
                </div>
              )}
              {showDetail.sold && <div style={{textAlign:"center",padding:"16px",background:"rgba(107,107,117,0.1)",borderRadius:12,color:"var(--muted)",fontWeight:600}}>This item has been sold</div>}
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT MODAL ─────────────────────────────────────── */}
      {showPayment && (
        <div className="overlay" onClick={()=>{if(payStep===1){setShowPayment(null);}}}>
          <div className="pay-modal" onClick={e=>e.stopPropagation()}>
            {payStep===1 && (<>
              <h2>Complete Purchase</h2>
              <p style={{color:"var(--muted)",fontSize:13,marginBottom:20}}>Secure checkout powered by HouseOfShivisha Pay</p>
              <div className="pay-summary">
                <div className="pay-row"><span>Item</span><span style={{color:"var(--white)",fontWeight:500,maxWidth:200,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{showPayment.title}</span></div>
                <div className="pay-row"><span>Platform fee (2%)</span><span>₹{Math.round(showPayment.price*0.02).toLocaleString("en-IN")}</span></div>
                <div className="pay-row total"><span>Total</span><span style={{color:"var(--gold)"}}>{fmtPrice(Math.round(showPayment.price*1.02))}</span></div>
              </div>
              <div style={{marginBottom:14,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"var(--muted)"}}>Payment Method</div>
              <div className="pay-methods">
                {[{id:"upi",icon:"📲",name:"UPI",desc:"GPay, PhonePe, Paytm"},{id:"card",icon:"💳",name:"Card",desc:"Credit / Debit Card"},{id:"netbanking",icon:"🏦",name:"Net Banking",desc:"All major banks"},{id:"wallet",icon:"👝",name:"Wallet",desc:"Paytm, Mobikwik"}].map(m=>(
                  <div key={m.id} className={`pay-method ${payMethod===m.id?"selected":""}`} onClick={()=>setPayMethod(m.id)}>
                    <span className="pay-method-icon">{m.icon}</span>
                    <div className="pay-method-info"><div className="pay-method-name">{m.name}</div><div className="pay-method-desc">{m.desc}</div></div>
                    <div className="pay-check"/>
                  </div>
                ))}
              </div>
              {payMethod==="upi" && <div className="pay-input-group"><label>UPI ID</label><input placeholder="yourname@upi" value={payFields.upi} onChange={e=>setPayFields(p=>({...p,upi:e.target.value}))}/></div>}
              {payMethod==="card" && (<>
                <div className="pay-input-group"><label>Card Number</label><input placeholder="1234 5678 9012 3456" value={payFields.card} onChange={e=>setPayFields(p=>({...p,card:e.target.value}))}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div className="pay-input-group"><label>Expiry</label><input placeholder="MM/YY" value={payFields.expiry} onChange={e=>setPayFields(p=>({...p,expiry:e.target.value}))}/></div>
                  <div className="pay-input-group"><label>CVV</label><input placeholder="•••" type="password" value={payFields.cvv} onChange={e=>setPayFields(p=>({...p,cvv:e.target.value}))}/></div>
                </div>
                <div className="pay-input-group"><label>Name on Card</label><input placeholder="Full Name" value={payFields.name} onChange={e=>setPayFields(p=>({...p,name:e.target.value}))}/></div>
              </>)}
              {payMethod==="wallet" && <div className="pay-input-group"><label>Wallet Number / ID</label><input placeholder="Mobile number or wallet ID" value={payFields.wallet} onChange={e=>setPayFields(p=>({...p,wallet:e.target.value}))}/></div>}
              <button className="btn btn-gold" style={{width:"100%",padding:"15px",fontSize:16,fontWeight:700,borderRadius:12,justifyContent:"center",marginTop:8}} onClick={handlePayment}>
                Pay {fmtPrice(Math.round(showPayment.price*1.02))} Securely 🔒
              </button>
              <div style={{textAlign:"center",fontSize:11.5,color:"var(--muted)",marginTop:12}}>🔒 256-bit SSL encrypted · 100% secure</div>
            </>)}
            {payStep===2 && (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div className="loader" style={{margin:"0 auto 20px"}}/>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:"var(--cream)"}}>Processing Payment...</div>
                <div style={{color:"var(--muted)",fontSize:13,marginTop:8}}>Please do not close this window</div>
              </div>
            )}
            {payStep===3 && (
              <div className="pay-success">
                <div className="pay-success-icon">✅</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:"var(--cream)",marginBottom:8}}>Payment Successful!</div>
                <div style={{color:"var(--muted)",fontSize:14}}>The seller will contact you within 24 hours.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── AUTH MODAL ─────────────────────────────────────────── */}
      {showAuth && (
        <div className="overlay" onClick={()=>setShowAuth(false)}>
          <div className="auth-modal" onClick={e=>e.stopPropagation()}>
            <button className="modal-close-btn" onClick={()=>setShowAuth(false)}>×</button>
            <div style={{color:"var(--gold)",fontSize:13,letterSpacing:2,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>✦ HouseOfShivisha</div>
            <h2>{authMode==="login"?"Welcome Back":"Create Account"}</h2>
            <p>{authMode==="login"?"Sign in to your account":"Join India's premium marketplace"}</p>
            {authMode==="signup" && (
              <div className="form-group">
                <label>Full Name</label>
                <input placeholder="Shivisha Patel" value={authData.name} onChange={e=>setAuthData(p=>({...p,name:e.target.value}))}/>
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@email.com" value={authData.email} onChange={e=>setAuthData(p=>({...p,email:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={authData.password} onChange={e=>setAuthData(p=>({...p,password:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")handleAuth();}}/>
            </div>
            {authMode==="signup" && (<>
              <div className="form-group">
                <label>City</label>
                <select value={authData.city} onChange={e=>setAuthData(p=>({...p,city:e.target.value}))}>
                  <option value="">Select your city</option>
                  {CITIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" placeholder="+91 98765 43210" value={authData.phone} onChange={e=>setAuthData(p=>({...p,phone:e.target.value}))}/>
              </div>
            </>)}
            <button className="btn btn-gold" style={{width:"100%",padding:"13px",fontSize:15,fontWeight:700,borderRadius:12,justifyContent:"center",marginTop:4}} onClick={handleAuth}>
              {authMode==="login"?"Sign In →":"Create Account →"}
            </button>
            {authMode==="login" && <div style={{textAlign:"center",margin:"14px 0 0",fontSize:12,color:"var(--muted)"}}>Demo: arjun@email.com / demo123</div>}
            <div className="auth-switch">{authMode==="login"?<>Don't have an account? <span onClick={()=>setAuthMode("signup")}>Sign up free</span></>:<>Already have an account? <span onClick={()=>setAuthMode("login")}>Sign in</span></>}</div>
            <div style={{marginTop:14,textAlign:"center",fontSize:11,color:"var(--muted)"}}>Admin access: admin@hos.com / any password</div>
          </div>
        </div>
      )}

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      {page!=="chat" && (
        <footer className="footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="logo" style={{fontSize:18}}>House<em>Of</em>Shivisha</div>
                <p>India's most trusted premium classifieds marketplace. Buy, sell, and connect with millions across the country.</p>
              </div>
              <div className="footer-col"><h4>Explore</h4><a onClick={()=>nav("browse")}>Browse Listings</a><a onClick={()=>setFilterCat("vehicles")&&nav("browse")}>Vehicles</a><a onClick={()=>setFilterCat("property")&&nav("browse")}>Property</a><a onClick={()=>setFilterCat("electronics")&&nav("browse")}>Electronics</a></div>
              <div className="footer-col"><h4>Sell</h4><a onClick={()=>nav("post")}>Post a Free Ad</a><a>Seller Tips</a><a>Pricing Guide</a><a>Verified Seller</a></div>
              <div className="footer-col"><h4>Support</h4><a>Help Center</a><a>Safety Tips</a><a>Terms of Service</a><a>Privacy Policy</a></div>
            </div>
            <div className="footer-bottom">
              <p>© 2024 HouseOfShivisha.com · All rights reserved</p>
              <p>Made with ❤️ in India</p>
            </div>
          </div>
        </footer>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
