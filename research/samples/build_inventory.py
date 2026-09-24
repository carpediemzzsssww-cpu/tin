"""Authoritative Gate B inventory: 18 public objects, 15 families, six style samples."""
import json, pathlib

BASE = pathlib.Path(__file__).resolve().parent
CATEGORIES = {'toys_charms':'玩具与挂件','daily_stuff':'日常物件','paper_memories':'纸与记忆','culture':'文化物件','random_shit':'随机杂物','found_outside':'户外拾物'}
# Dimensions are proposed miniature-object sizes in millimetres, not measurements of source photos.
ROWS = [
 ('dice_red_01','红骰子','toys_charms','dice','red','plastic',16,16,16,'S','ai_pre_generated','plastic','hard_click',False),
 ('dice_ivory_01','象牙白骰子','toys_charms','dice','ivory','plastic',16,16,16,'S','ai_pre_generated',None,'hard_click',False),
 ('plush_gray_01','灰色小熊挂件','toys_charms','plush','gray_bear','plush',38,48,12,'M','ai_pre_generated','plush','soft_drop',False),
 ('earphones_white_coiled_01','白色半卷耳机','daily_stuff','earphones','white_half_coiled','cable',64,60,7,'M','ai_pre_generated','cable','soft_plastic',True),
 ('earphones_black_coiled_01','黑色半卷耳机','daily_stuff','earphones','black_half_coiled','cable',64,60,7,'M','ai_pre_generated',None,'soft_plastic',True),
 ('hairclip_silver_01','银色弹片发夹','daily_stuff','hairclip','silver','metal',42,12,3,'M','ai_pre_generated',None,'light_metal',False),
 ('key_silver_01','银色家门钥匙','daily_stuff','key','silver','metal',22,55,2,'M','ai_pre_generated','metal','light_metal',False),
 ('ticket_cream_01','白纸电影票根','paper_memories','ticket','cream','paper',70,33,0.25,'L','procedural_svg','paper','paper_rustle',False),
 ('ticket_blue_01','浅蓝电影票根','paper_memories','ticket','blue','paper',70,33,0.25,'L','procedural_svg',None,'paper_rustle',False),
 ('receipt_white_01','普通小票','paper_memories','receipt','white','paper',29,66,0.15,'M','procedural_svg',None,'paper_rustle',False),
 ('pick_red_01','红色吉他拨片','culture','guitar_pick','red','plastic',25,30,0.8,'S','ai_pre_generated',None,'light_plastic',False),
 ('cartridge_gray_01','无品牌游戏卡带','culture','game_cartridge','gray','plastic',33,35,4,'S','ai_pre_generated',None,'hard_click',False),
 ('film_strip_01','短段负片','culture','film','amber','mixed',35,70,0.2,'L','procedural_svg',None,'paper_rustle',False),
 ('bottlecap_blue_01','蓝色瓶盖','random_shit','bottlecap','blue','metal',26,26,6,'S','ai_pre_generated',None,'light_metal',False),
 ('blister_clear_01','透明泡罩药板','random_shit','blister','clear_foil','mixed',32,50,5,'M','ai_pre_generated','transparent','soft_plastic',False),
 ('paperclip_silver_01','银色回形针','random_shit','paperclip','silver','metal',10,28,1,'S','procedural_3d',None,'light_metal',False),
 ('shell_small_01','小贝壳','found_outside','shell','ivory','shell',25,22,8,'S','ai_pre_generated',None,'hard_click',False),
 ('leaf_green_01','普通绿叶','found_outside','leaf','green','leaf',24,48,0.4,'M','ai_pre_generated',None,'paper_rustle',False),
]

def build():
    entries=[]
    for row in ROWS:
        id,name,category,family,variant,material,w,h,d,size,method,sample,feedback,overflow=row
        procedural=method.startswith('procedural')
        entries.append({
          'id':id,'name':name,'category':category,'category_label':CATEGORIES[category],
          'family':family,'variant':variant,'material':material,
          'physical_size_mm':{'width':w,'height':h,'depth':d},'size_class':size,
          'render_mode':'2.5d_cutout','source_method':method,
          'source':{'kind':method,'record':'generation-log.json' if not procedural else 'paper-template.js' if 'ticket' in id else 'planned_original_procedural','url':None},
          'author':'TIN 项目原创程序' if procedural else 'TIN 项目 / imagegen 预生成',
          'license_status':'project_original' if procedural else 'generated_original_pending_visual_review',
          'license_note':'项目内自制；无第三方图片许可依赖；未声明 CC0' if procedural else '项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性',
          'needs_cutout':not procedural,'needs_reverse_side':False,
          'customizable_fields':[{'key':'event','label':'名称','max_length':24},{'key':'date','label':'日期','max_length':16},{'key':'seat','label':'座位','max_length':8}] if family=='ticket' else [],
          'physics_feedback':feedback,'physical_simulation':False,
          'copyright_review':'无品牌通用物件；检查生成图的意外标记与角色相似性' if not procedural else '项目原创几何与模板；采用系统字体，无外部图案',
          'attribution_required':False,'mvp':True,'sample_material':sample,
          'status':'sample_in_progress' if sample else 'planned',
          'asset_path':None,'alpha_bounds':None,'canonical_rotation_deg':0,
          'scale_limits':[0.8,1.2],'allow_partial_overflow':overflow,
          'preferred_surface':'lid' if material=='paper' else 'tray',
          'default_layer_band':'paper' if material=='paper' else 'object',
          'tin_match':{'silver':0.9 if category!='found_outside' else 0.7},
          'tags':[material,family,'contemporary' if category!='found_outside' else 'found'],
        })
    existing=BASE/'data/inventory.json'
    # Keep real production/QA evidence across inventory rebuilds.
    old={r['id']:r for r in json.loads(existing.read_text()).get('objects',[])} if existing.exists() else {}
    for r in entries:
        if r['id'] in old:
            for key in ['status','asset_path','alpha_bounds','qa','source','pixel_size','license_status']:
                if key in old[r['id']]: r[key]=old[r['id']][key]
    data={
      'version':'0.2','direction':'A','gate_a':'approved','gate_b':'pending_review',
      'dimension_note':'项目定义的迷你物件外接尺寸上限，单位 mm；图像等比适配该框，禁止拉伸。并非来源照片实测尺寸。',
      'composition_note':'物件推荐与层级为初始建议；用户拖放结果优先。',
      'core_assets':[
        {'id':'tin_silver_01','name':'裸银圆角铁盒','render_mode':'3d_mesh','source_method':'original_parametric_3d','physical_size_mm':{'width':90,'height':125,'depth':19},'source':'tin-model.js','status':'sample_in_progress','needs_reverse_side':True},
        {'id':'lining_white_folded_01','name':'白色微折纸内衬','render_mode':'procedural_material','source_method':'original_canvas','physical_size_mm':{'width':85,'height':120,'depth':0.2},'source':'tin-model.js','status':'sample_in_progress','needs_reverse_side':False},
      ],
      'objects':entries,
      'yours_templates':{
        'photos':['postcard','photobooth_strip','stamp','frame'],
        'text':['dymo_label','handwritten_note','letter_beads'],
        'status':'planned_after_gate_b','note':'YOURS 是用户内容载体，不计入18件公共物件。'
      }
    }
    assert len(entries)==18 and len({r['family'] for r in entries})==15
    assert len([r for r in entries if r['sample_material']])==6
    assert set(r['sample_material'] for r in entries if r['sample_material'])=={'metal','paper','plastic','plush','transparent','cable'}
    if all(r['status']=='sample_ready' for r in entries if r['sample_material']):
        for core in data['core_assets']: core['status']='sample_ready'
    (BASE/'data').mkdir(exist_ok=True)
    existing.write_text(json.dumps(data,ensure_ascii=False,indent=2))
    (BASE/'inventory-data.js').write_text('window.TIN_INVENTORY = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n')
    rows=['# TIN · A 方向资产清单 v0.2','','Gate A 已确认；Gate B 待审。18 件公共物件、15 个物件族、6 个材质样品。所有尺寸为项目定义的毫米基线。','',
          '| ID | 物件 | 分类 | 物件族 / 变体 | 材质 | 宽×高×厚 mm | 生产方式 | 六材质样品 | 状态 |',
          '|---|---|---|---|---|---|---|---|---|']
    for r in entries:
        z=r['physical_size_mm'];rows.append(f"| {r['id']} | {r['name']} | {r['category_label']} | {r['family']} / {r['variant']} | {r['material']} | {z['width']}×{z['height']}×{z['depth']} | {r['source_method']} | {r['sample_material'] or '—'} | {r['status']} |")
    rows+=['','## 逐件生产说明','']
    for r in entries:
        rows += [f"### {r['id']} · {r['name']}",f"- 形式：{r['render_mode']}；抠图需求：{'是，要求真实 alpha' if r['needs_cutout'] else '程序化直接输出'}；背面：首版不需要。",f"- 自定义：{', '.join(f['label'] for f in r['customizable_fields']) or '无'}；反馈：{r['physics_feedback']}；物理模拟：无。",f"- 标准尺寸缩放：0.8–1.2×；局部越界：{'允许' if r['allow_partial_overflow'] else '默认不允许'}；建议空间：{r['preferred_surface']}。",f"- 来源记录：{r['source']['record']}；版权检查：{r['copyright_review']}。",f"- 作者：{r['author']}；许可状态：{r['license_status']}；{r['license_note']}。",f"- 文件：{r['asset_path'] or '尚未生产，不以参考图代替正式素材'}；MVP：是。",f"- 样品检查：{r.get('qa',{}).get('visual_note','尚未生产')}。",'']
    rows+=['## 范围说明','','铁盒与内衬为两个独立基础资产。YOURS 的四种照片载体、三种文字载体在 Gate B 后开发，不计入18件公共物件。线材首版采用预设姿态，不做柔体物理。','']
    (BASE/'ASSET_INVENTORY.md').write_text('\n'.join(rows))
    return data

if __name__=='__main__':
    result=build();print('18 objects / 15 families / 6 samples; inventory written')
