window.TIN_INVENTORY = {
  "version": "0.2",
  "direction": "A",
  "gate_a": "approved",
  "gate_b": "pending_review",
  "dimension_note": "项目定义的迷你物件外接尺寸上限，单位 mm；图像等比适配该框，禁止拉伸。并非来源照片实测尺寸。",
  "composition_note": "物件推荐与层级为初始建议；用户拖放结果优先。",
  "core_assets": [
    {
      "id": "tin_silver_01",
      "name": "裸银圆角铁盒",
      "render_mode": "3d_mesh",
      "source_method": "original_parametric_3d",
      "physical_size_mm": {
        "width": 90,
        "height": 125,
        "depth": 19
      },
      "source": "tin-model.js",
      "status": "sample_ready",
      "needs_reverse_side": true
    },
    {
      "id": "lining_white_folded_01",
      "name": "白色微折纸内衬",
      "render_mode": "procedural_material",
      "source_method": "original_canvas",
      "physical_size_mm": {
        "width": 85,
        "height": 120,
        "depth": 0.2
      },
      "source": "tin-model.js",
      "status": "sample_ready",
      "needs_reverse_side": false
    }
  ],
  "objects": [
    {
      "id": "dice_red_01",
      "name": "红骰子",
      "category": "toys_charms",
      "category_label": "玩具与挂件",
      "family": "dice",
      "variant": "red",
      "material": "plastic",
      "physical_size_mm": {
        "width": 16,
        "height": 16,
        "depth": 16
      },
      "size_class": "S",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "assets/generation-log.json#dice_red_01",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "hard_click",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": "plastic",
      "status": "sample_ready",
      "asset_path": "assets/dice_red_01-v2.png",
      "alpha_bounds": [
        199,
        199,
        1057,
        1050
      ],
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "plastic",
        "dice",
        "contemporary"
      ],
      "qa": {
        "true_alpha": true,
        "alpha_bounds_threshold": 8,
        "sha256": "3eaa8f0eebd712c0047e904f878fdf9f36c279181aa7c18e9fef9e480a48f517",
        "production_final": false,
        "visual_note": "透明留白中残留极低 alpha 杂点；场景忽略不可见低值。",
        "generation_notes": [
          "Top face has correct five-pip pattern; thin visible side faces and red plastic verified.",
          "Very low-alpha detached speckles remain in transparent margin; no pixel cleanup applied."
        ],
        "input_sha_verified": true
      },
      "pixel_size": [
        1254,
        1254
      ]
    },
    {
      "id": "dice_ivory_01",
      "name": "象牙白骰子",
      "category": "toys_charms",
      "category_label": "玩具与挂件",
      "family": "dice",
      "variant": "ivory",
      "material": "plastic",
      "physical_size_mm": {
        "width": 16,
        "height": 16,
        "depth": 16
      },
      "size_class": "S",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "generation-log.json",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "hard_click",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "plastic",
        "dice",
        "contemporary"
      ]
    },
    {
      "id": "plush_gray_01",
      "name": "灰色小熊挂件",
      "category": "toys_charms",
      "category_label": "玩具与挂件",
      "family": "plush",
      "variant": "gray_bear",
      "material": "plush",
      "physical_size_mm": {
        "width": 38,
        "height": 48,
        "depth": 12
      },
      "size_class": "M",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "assets/generation-log.json#plush_gray_01",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "soft_drop",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": "plush",
      "status": "sample_ready",
      "asset_path": "assets/plush_gray_01-v3.png",
      "alpha_bounds": [
        362,
        246,
        903,
        1031
      ],
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "plush",
        "plush",
        "contemporary"
      ],
      "qa": {
        "true_alpha": true,
        "alpha_bounds_threshold": 8,
        "sha256": "a75f9882e0362038a07cc6834eceffd876e931df6a2dbaebc2f3803f213de7b3",
        "production_final": false,
        "visual_note": "高倍查看仍有细小彩色边缘，正式入库前需要精修。",
        "generation_notes": [
          "Two ears, arms, legs, metal ring and fabric fibers verified.",
          "Tiny yellow/red edge fragments and low-alpha speckles remain; final production edge cleanup still required."
        ],
        "input_sha_verified": true
      },
      "pixel_size": [
        1254,
        1254
      ]
    },
    {
      "id": "earphones_white_coiled_01",
      "name": "白色半卷耳机",
      "category": "daily_stuff",
      "category_label": "日常物件",
      "family": "earphones",
      "variant": "white_half_coiled",
      "material": "cable",
      "physical_size_mm": {
        "width": 64,
        "height": 60,
        "depth": 7
      },
      "size_class": "M",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "assets/generation-log.json#earphones_white_coiled_01",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "soft_plastic",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": "cable",
      "status": "sample_ready",
      "asset_path": "assets/earphones_white_coiled_01-v3.png",
      "alpha_bounds": [
        318,
        324,
        973,
        973
      ],
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": true,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "cable",
        "earphones",
        "contemporary"
      ],
      "qa": {
        "true_alpha": true,
        "alpha_bounds_threshold": 8,
        "sha256": "e480725eb91debadd9d4ff647e4163f09d6fb356b15e06fdbf62e10e3b61481e",
        "production_final": false,
        "visual_note": "深色背景下仍可见细白边；正式入库前需要精修。",
        "generation_notes": [
          "Two ear tips, Y-junction, one remote and one audio plug verified; cable joins visually continuous.",
          "White edge fringe remains around wire and some low-alpha speckles remain; gate review sample, not final alpha-clean production texture."
        ],
        "input_sha_verified": true
      },
      "pixel_size": [
        1254,
        1254
      ]
    },
    {
      "id": "earphones_black_coiled_01",
      "name": "黑色半卷耳机",
      "category": "daily_stuff",
      "category_label": "日常物件",
      "family": "earphones",
      "variant": "black_half_coiled",
      "material": "cable",
      "physical_size_mm": {
        "width": 64,
        "height": 60,
        "depth": 7
      },
      "size_class": "M",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "generation-log.json",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "soft_plastic",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": true,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "cable",
        "earphones",
        "contemporary"
      ]
    },
    {
      "id": "hairclip_silver_01",
      "name": "银色弹片发夹",
      "category": "daily_stuff",
      "category_label": "日常物件",
      "family": "hairclip",
      "variant": "silver",
      "material": "metal",
      "physical_size_mm": {
        "width": 42,
        "height": 12,
        "depth": 3
      },
      "size_class": "M",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "generation-log.json",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "light_metal",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "metal",
        "hairclip",
        "contemporary"
      ]
    },
    {
      "id": "key_silver_01",
      "name": "银色家门钥匙",
      "category": "daily_stuff",
      "category_label": "日常物件",
      "family": "key",
      "variant": "silver",
      "material": "metal",
      "physical_size_mm": {
        "width": 22,
        "height": 55,
        "depth": 2
      },
      "size_class": "M",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "assets/generation-log.json#key_silver_01",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "light_metal",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": "metal",
      "status": "sample_ready",
      "asset_path": "assets/key_silver_01-v3.png",
      "alpha_bounds": [
        490,
        302,
        768,
        980
      ],
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "metal",
        "key",
        "contemporary"
      ],
      "qa": {
        "true_alpha": true,
        "alpha_bounds_threshold": 8,
        "sha256": "c9ec5589ae763b03eceb6d1102753ed437e3ffbf5b383b80158fa6286a2f26f0",
        "production_final": false,
        "visual_note": "高倍查看仍有少量暖色边缘；当前仅为审核样品。",
        "generation_notes": [
          "Silhouette, grooves, key hole and realistic metal wear visually verified.",
          "Tiny warm-colored edge fringes remain at full resolution; acceptable for review only, inspect at target mobile scale."
        ],
        "input_sha_verified": true
      },
      "pixel_size": [
        1254,
        1254
      ]
    },
    {
      "id": "ticket_cream_01",
      "name": "白纸电影票根",
      "category": "paper_memories",
      "category_label": "纸与记忆",
      "family": "ticket",
      "variant": "cream",
      "material": "paper",
      "physical_size_mm": {
        "width": 70,
        "height": 33,
        "depth": 0.25
      },
      "size_class": "L",
      "render_mode": "2.5d_cutout",
      "source_method": "procedural_svg",
      "source": {
        "kind": "procedural_svg",
        "record": "paper-template.js",
        "url": null
      },
      "author": "TIN 项目原创程序",
      "license_status": "project_original",
      "license_note": "项目内自制；无第三方图片许可依赖；未声明 CC0",
      "needs_cutout": false,
      "needs_reverse_side": false,
      "customizable_fields": [
        {
          "key": "event",
          "label": "名称",
          "max_length": 24
        },
        {
          "key": "date",
          "label": "日期",
          "max_length": 16
        },
        {
          "key": "seat",
          "label": "座位",
          "max_length": 8
        }
      ],
      "physics_feedback": "paper_rustle",
      "physical_simulation": false,
      "copyright_review": "项目原创几何与模板；采用系统字体，无外部图案",
      "attribution_required": false,
      "mvp": true,
      "sample_material": "paper",
      "status": "sample_ready",
      "asset_path": "assets/ticket_cream_01.svg",
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "lid",
      "default_layer_band": "paper",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "paper",
        "ticket",
        "contemporary"
      ],
      "qa": {
        "true_alpha": "SVG has no background outside paper path",
        "sha256": "4a3fc7a60ef3b707838866ae171b9e64b6e2d7fc81b36776931a2dc98ea26328",
        "production_final": false,
        "visual_note": "原创可编辑模板；纸纹、排版与比例待审核。"
      },
      "pixel_size": [
        840,
        396
      ]
    },
    {
      "id": "ticket_blue_01",
      "name": "浅蓝电影票根",
      "category": "paper_memories",
      "category_label": "纸与记忆",
      "family": "ticket",
      "variant": "blue",
      "material": "paper",
      "physical_size_mm": {
        "width": 70,
        "height": 33,
        "depth": 0.25
      },
      "size_class": "L",
      "render_mode": "2.5d_cutout",
      "source_method": "procedural_svg",
      "source": {
        "kind": "procedural_svg",
        "record": "paper-template.js",
        "url": null
      },
      "author": "TIN 项目原创程序",
      "license_status": "project_original",
      "license_note": "项目内自制；无第三方图片许可依赖；未声明 CC0",
      "needs_cutout": false,
      "needs_reverse_side": false,
      "customizable_fields": [
        {
          "key": "event",
          "label": "名称",
          "max_length": 24
        },
        {
          "key": "date",
          "label": "日期",
          "max_length": 16
        },
        {
          "key": "seat",
          "label": "座位",
          "max_length": 8
        }
      ],
      "physics_feedback": "paper_rustle",
      "physical_simulation": false,
      "copyright_review": "项目原创几何与模板；采用系统字体，无外部图案",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "lid",
      "default_layer_band": "paper",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "paper",
        "ticket",
        "contemporary"
      ]
    },
    {
      "id": "receipt_white_01",
      "name": "普通小票",
      "category": "paper_memories",
      "category_label": "纸与记忆",
      "family": "receipt",
      "variant": "white",
      "material": "paper",
      "physical_size_mm": {
        "width": 29,
        "height": 66,
        "depth": 0.15
      },
      "size_class": "M",
      "render_mode": "2.5d_cutout",
      "source_method": "procedural_svg",
      "source": {
        "kind": "procedural_svg",
        "record": "planned_original_procedural",
        "url": null
      },
      "author": "TIN 项目原创程序",
      "license_status": "project_original",
      "license_note": "项目内自制；无第三方图片许可依赖；未声明 CC0",
      "needs_cutout": false,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "paper_rustle",
      "physical_simulation": false,
      "copyright_review": "项目原创几何与模板；采用系统字体，无外部图案",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "lid",
      "default_layer_band": "paper",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "paper",
        "receipt",
        "contemporary"
      ]
    },
    {
      "id": "pick_red_01",
      "name": "红色吉他拨片",
      "category": "culture",
      "category_label": "文化物件",
      "family": "guitar_pick",
      "variant": "red",
      "material": "plastic",
      "physical_size_mm": {
        "width": 25,
        "height": 30,
        "depth": 0.8
      },
      "size_class": "S",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "generation-log.json",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "light_plastic",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "plastic",
        "guitar_pick",
        "contemporary"
      ]
    },
    {
      "id": "cartridge_gray_01",
      "name": "无品牌游戏卡带",
      "category": "culture",
      "category_label": "文化物件",
      "family": "game_cartridge",
      "variant": "gray",
      "material": "plastic",
      "physical_size_mm": {
        "width": 33,
        "height": 35,
        "depth": 4
      },
      "size_class": "S",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "generation-log.json",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "hard_click",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "plastic",
        "game_cartridge",
        "contemporary"
      ]
    },
    {
      "id": "film_strip_01",
      "name": "短段负片",
      "category": "culture",
      "category_label": "文化物件",
      "family": "film",
      "variant": "amber",
      "material": "mixed",
      "physical_size_mm": {
        "width": 35,
        "height": 70,
        "depth": 0.2
      },
      "size_class": "L",
      "render_mode": "2.5d_cutout",
      "source_method": "procedural_svg",
      "source": {
        "kind": "procedural_svg",
        "record": "planned_original_procedural",
        "url": null
      },
      "author": "TIN 项目原创程序",
      "license_status": "project_original",
      "license_note": "项目内自制；无第三方图片许可依赖；未声明 CC0",
      "needs_cutout": false,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "paper_rustle",
      "physical_simulation": false,
      "copyright_review": "项目原创几何与模板；采用系统字体，无外部图案",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "mixed",
        "film",
        "contemporary"
      ]
    },
    {
      "id": "bottlecap_blue_01",
      "name": "蓝色瓶盖",
      "category": "random_shit",
      "category_label": "随机杂物",
      "family": "bottlecap",
      "variant": "blue",
      "material": "metal",
      "physical_size_mm": {
        "width": 26,
        "height": 26,
        "depth": 6
      },
      "size_class": "S",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "generation-log.json",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "light_metal",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "metal",
        "bottlecap",
        "contemporary"
      ]
    },
    {
      "id": "blister_clear_01",
      "name": "透明泡罩药板",
      "category": "random_shit",
      "category_label": "随机杂物",
      "family": "blister",
      "variant": "clear_foil",
      "material": "mixed",
      "physical_size_mm": {
        "width": 32,
        "height": 50,
        "depth": 5
      },
      "size_class": "M",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "assets/generation-log.json#blister_clear_01",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "soft_plastic",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": "transparent",
      "status": "sample_ready",
      "asset_path": "assets/blister_clear_01-v3.png",
      "alpha_bounds": [
        397,
        306,
        858,
        988
      ],
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "mixed",
        "blister",
        "contemporary"
      ],
      "qa": {
        "true_alpha": true,
        "alpha_bounds_threshold": 8,
        "sha256": "ab2eadfbf515abfde4b9793481b0012de64557a7811126a7fefd390072dd697a",
        "production_final": false,
        "visual_note": "局部薄边需最终复核；泡罩保留背衬，破口真实透明。",
        "generation_notes": [
          "Six compartments in two columns and three rows; open holes genuinely alpha-transparent.",
          "Selected dimensions must be width 32mm × height 50mm.",
          "Foil backing dominates; transparent plastic effect reads through highlights, not full scene refraction.",
          "Tiny colored edge fragments remain; gate review sample."
        ],
        "input_sha_verified": true
      },
      "pixel_size": [
        1254,
        1254
      ]
    },
    {
      "id": "paperclip_silver_01",
      "name": "银色回形针",
      "category": "random_shit",
      "category_label": "随机杂物",
      "family": "paperclip",
      "variant": "silver",
      "material": "metal",
      "physical_size_mm": {
        "width": 10,
        "height": 28,
        "depth": 1
      },
      "size_class": "S",
      "render_mode": "2.5d_cutout",
      "source_method": "procedural_3d",
      "source": {
        "kind": "procedural_3d",
        "record": "planned_original_procedural",
        "url": null
      },
      "author": "TIN 项目原创程序",
      "license_status": "project_original",
      "license_note": "项目内自制；无第三方图片许可依赖；未声明 CC0",
      "needs_cutout": false,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "light_metal",
      "physical_simulation": false,
      "copyright_review": "项目原创几何与模板；采用系统字体，无外部图案",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.9
      },
      "tags": [
        "metal",
        "paperclip",
        "contemporary"
      ]
    },
    {
      "id": "shell_small_01",
      "name": "小贝壳",
      "category": "found_outside",
      "category_label": "户外拾物",
      "family": "shell",
      "variant": "ivory",
      "material": "shell",
      "physical_size_mm": {
        "width": 25,
        "height": 22,
        "depth": 8
      },
      "size_class": "S",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "generation-log.json",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "hard_click",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.7
      },
      "tags": [
        "shell",
        "shell",
        "found"
      ]
    },
    {
      "id": "leaf_green_01",
      "name": "普通绿叶",
      "category": "found_outside",
      "category_label": "户外拾物",
      "family": "leaf",
      "variant": "green",
      "material": "leaf",
      "physical_size_mm": {
        "width": 24,
        "height": 48,
        "depth": 0.4
      },
      "size_class": "M",
      "render_mode": "2.5d_cutout",
      "source_method": "ai_pre_generated",
      "source": {
        "kind": "ai_pre_generated",
        "record": "generation-log.json",
        "url": null
      },
      "author": "TIN 项目 / imagegen 预生成",
      "license_status": "generated_original_pending_visual_review",
      "license_note": "项目内生成，保留提示词与原始输出；未声明 CC0；需检查意外品牌与角色相似性",
      "needs_cutout": true,
      "needs_reverse_side": false,
      "customizable_fields": [],
      "physics_feedback": "paper_rustle",
      "physical_simulation": false,
      "copyright_review": "无品牌通用物件；检查生成图的意外标记与角色相似性",
      "attribution_required": false,
      "mvp": true,
      "sample_material": null,
      "status": "planned",
      "asset_path": null,
      "alpha_bounds": null,
      "canonical_rotation_deg": 0,
      "scale_limits": [
        0.8,
        1.2
      ],
      "allow_partial_overflow": false,
      "preferred_surface": "tray",
      "default_layer_band": "object",
      "tin_match": {
        "silver": 0.7
      },
      "tags": [
        "leaf",
        "leaf",
        "found"
      ]
    }
  ],
  "yours_templates": {
    "photos": [
      "postcard",
      "photobooth_strip",
      "stamp",
      "frame"
    ],
    "text": [
      "dymo_label",
      "handwritten_note",
      "letter_beads"
    ],
    "status": "planned_after_gate_b",
    "note": "YOURS 是用户内容载体，不计入18件公共物件。"
  }
};
