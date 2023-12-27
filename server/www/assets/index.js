var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload"))
    return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]'))
    processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList")
        continue;
      for (const node of mutation.addedNodes)
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const style = "";
function noop() {
}
const identity = (x) => x;
function assign(tar, src) {
  for (const k in src)
    tar[k] = src[k];
  return (
    /** @type {T & S} */
    tar
  );
}
function is_promise(value) {
  return !!value && (typeof value === "object" || typeof value === "function") && typeof /** @type {any} */
  value.then === "function";
}
function add_location(element2, file2, line, column, char) {
  element2.__svelte_meta = {
    loc: { file: file2, line, column, char }
  };
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function validate_store(store, name) {
  if (store != null && typeof store.subscribe !== "function") {
    throw new Error(`'${name}' is not a store with a 'subscribe' method`);
  }
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn ? assign($$scope.ctx.slice(), definition[1](fn(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function exclude_internal_props(props) {
  const result = {};
  for (const k in props)
    if (k[0] !== "$")
      result[k] = props[k];
  return result;
}
const is_client = typeof window !== "undefined";
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? (cb) => requestAnimationFrame(cb) : noop;
const tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : (
  // @ts-ignore Node typings have this
  global
);
function append(target, node) {
  target.appendChild(node);
}
function get_root_for_style(node) {
  if (!node)
    return document;
  const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
  if (root && /** @type {ShadowRoot} */
  root.host) {
    return (
      /** @type {ShadowRoot} */
      root
    );
  }
  return node.ownerDocument;
}
function append_empty_stylesheet(node) {
  const style_element = element("style");
  style_element.textContent = "/* empty */";
  append_stylesheet(get_root_for_style(node), style_element);
  return style_element.sheet;
}
function append_stylesheet(node, style2) {
  append(
    /** @type {Document} */
    node.head || node,
    style2
  );
  return style2.sheet;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(" ");
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value == null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
const managed_styles = /* @__PURE__ */ new Map();
let active = 0;
function hash(str) {
  let hash2 = 5381;
  let i = str.length;
  while (i--)
    hash2 = (hash2 << 5) - hash2 ^ str.charCodeAt(i);
  return hash2 >>> 0;
}
function create_style_information(doc, node) {
  const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
  managed_styles.set(doc, info);
  return info;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p = 0; p <= 1; p += step) {
    const t = a + (b - a) * ease(p);
    keyframes += p * 100 + `%{${fn(t, 1 - t)}}
`;
  }
  const rule = keyframes + `100% {${fn(b, 1 - b)}}
}`;
  const name = `__svelte_${hash(rule)}_${uid}`;
  const doc = get_root_for_style(node);
  const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
  if (!rules[name]) {
    rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  const previous = (node.style.animation || "").split(", ");
  const next = previous.filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("__svelte") === -1
    // remove all Svelte animations
  );
  const deleted = previous.length - next.length;
  if (deleted) {
    node.style.animation = next.join(", ");
    active -= deleted;
    if (!active)
      clear_rules();
  }
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    managed_styles.forEach((info) => {
      const { ownerNode } = info.stylesheet;
      if (ownerNode)
        detach(ownerNode);
    });
    managed_styles.clear();
  });
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
function flush_render_callbacks(fns) {
  const filtered = [];
  const targets = [];
  render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
  targets.forEach((c) => c());
  render_callbacks = filtered;
}
let promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  const options = { direction: "in" };
  let config = fn(node, params, options);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(t, 1 - t);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started)
        return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config(options);
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  const options = { direction: "out" };
  let config = fn(node, params, options);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  let original_inert_value;
  function go() {
    const {
      delay = 0,
      duration = 300,
      easing = identity,
      tick = noop,
      css
    } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    if ("inert" in node) {
      original_inert_value = /** @type {HTMLElement} */
      node.inert;
      node.inert = true;
    }
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config(options);
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && "inert" in node) {
        node.inert = original_inert_value;
      }
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name)
          delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function handle_promise(promise2, info) {
  const token = info.token = {};
  function update2(type, index, key, value) {
    if (info.token !== token)
      return;
    info.resolved = value;
    let child_ctx = info.ctx;
    if (key !== void 0) {
      child_ctx = child_ctx.slice();
      child_ctx[key] = value;
    }
    const block = type && (info.current = type)(child_ctx);
    let needs_flush = false;
    if (info.block) {
      if (info.blocks) {
        info.blocks.forEach((block2, i) => {
          if (i !== index && block2) {
            group_outros();
            transition_out(block2, 1, 1, () => {
              if (info.blocks[i] === block2) {
                info.blocks[i] = null;
              }
            });
            check_outros();
          }
        });
      } else {
        info.block.d(1);
      }
      block.c();
      transition_in(block, 1);
      block.m(info.mount(), info.anchor);
      needs_flush = true;
    }
    info.block = block;
    if (info.blocks)
      info.blocks[index] = block;
    if (needs_flush) {
      flush();
    }
  }
  if (is_promise(promise2)) {
    const current_component2 = get_current_component();
    promise2.then(
      (value) => {
        set_current_component(current_component2);
        update2(info.then, 1, info.value, value);
        set_current_component(null);
      },
      (error2) => {
        set_current_component(current_component2);
        update2(info.catch, 2, info.error, error2);
        set_current_component(null);
        if (!info.hasCatch) {
          throw error2;
        }
      }
    );
    if (info.current !== info.pending) {
      update2(info.pending, 0);
      return true;
    }
  } else {
    if (info.current !== info.then) {
      update2(info.then, 1, info.value, promise2);
      return true;
    }
    info.resolved = /** @type {T} */
    promise2;
  }
}
function update_await_block_branch(info, ctx, dirty) {
  const child_ctx = ctx.slice();
  const { resolved } = info;
  if (info.current === info.then) {
    child_ctx[info.value] = resolved;
  }
  if (info.current === info.catch) {
    child_ctx[info.error] = resolved;
  }
  info.block.p(child_ctx, dirty);
}
function ensure_array_like(array_like_or_iterator) {
  return (array_like_or_iterator == null ? void 0 : array_like_or_iterator.length) !== void 0 ? array_like_or_iterator : Array.from(array_like_or_iterator);
}
function get_spread_update(levels, updates) {
  const update2 = {};
  const to_null_out = {};
  const accounted_for = { $$scope: 1 };
  let i = levels.length;
  while (i--) {
    const o = levels[i];
    const n = updates[i];
    if (n) {
      for (const key in o) {
        if (!(key in n))
          to_null_out[key] = 1;
      }
      for (const key in n) {
        if (!accounted_for[key]) {
          update2[key] = n[key];
          accounted_for[key] = 1;
        }
      }
      levels[i] = n;
    } else {
      for (const key in o) {
        accounted_for[key] = 1;
      }
    }
  }
  for (const key in to_null_out) {
    if (!(key in update2))
      update2[key] = void 0;
  }
  return update2;
}
function get_spread_object(spread_props) {
  return typeof spread_props === "object" && spread_props !== null ? spread_props : {};
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  add_render_callback(() => {
    const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
    if (component.$$.on_destroy) {
      component.$$.on_destroy.push(...new_on_destroy);
    } else {
      run_all(new_on_destroy);
    }
    component.$$.on_mount = [];
  });
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    flush_render_callbacks($$.after_update);
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    __publicField(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(props) {
    if (this.$$set && !is_empty(props)) {
      this.$$.skip_bound = true;
      this.$$set(props);
      this.$$.skip_bound = false;
    }
  }
}
const VERSION = "4.2.0";
const PUBLIC_VERSION = "4";
function dispatch_dev(type, detail) {
  document.dispatchEvent(custom_event(type, { version: VERSION, ...detail }, { bubbles: true }));
}
function append_dev(target, node) {
  dispatch_dev("SvelteDOMInsert", { target, node });
  append(target, node);
}
function insert_dev(target, node, anchor) {
  dispatch_dev("SvelteDOMInsert", { target, node, anchor });
  insert(target, node, anchor);
}
function detach_dev(node) {
  dispatch_dev("SvelteDOMRemove", { node });
  detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
  const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
  if (has_prevent_default)
    modifiers.push("preventDefault");
  if (has_stop_propagation)
    modifiers.push("stopPropagation");
  if (has_stop_immediate_propagation)
    modifiers.push("stopImmediatePropagation");
  dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
  const dispose = listen(node, event, handler, options);
  return () => {
    dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
    dispose();
  };
}
function attr_dev(node, attribute, value) {
  attr(node, attribute, value);
  if (value == null)
    dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
  else
    dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
}
function prop_dev(node, property, value) {
  node[property] = value;
  dispatch_dev("SvelteDOMSetProperty", { node, property, value });
}
function set_data_dev(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  dispatch_dev("SvelteDOMSetData", { node: text2, data });
  text2.data = /** @type {string} */
  data;
}
function ensure_array_like_dev(arg) {
  if (typeof arg !== "string" && !(arg && typeof arg === "object" && "length" in arg) && !(typeof Symbol === "function" && arg && Symbol.iterator in arg)) {
    throw new Error("{#each} only works with iterable values.");
  }
  return ensure_array_like(arg);
}
function validate_slots(name, slot, keys) {
  for (const slot_key of Object.keys(slot)) {
    if (!~keys.indexOf(slot_key)) {
      console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
    }
  }
}
function construct_svelte_component_dev(component, props) {
  const error_message = "this={...} of <svelte:component> should specify a Svelte component.";
  try {
    const instance2 = new component(props);
    if (!instance2.$$ || !instance2.$set || !instance2.$on || !instance2.$destroy) {
      throw new Error(error_message);
    }
    return instance2;
  } catch (err) {
    const { message } = err;
    if (typeof message === "string" && message.indexOf("is not a constructor") !== -1) {
      throw new Error(error_message);
    } else {
      throw err;
    }
  }
}
class SvelteComponentDev extends SvelteComponent {
  /** @param {import('./public.js').ComponentConstructorOptions<Props>} options */
  constructor(options) {
    if (!options || !options.target && !options.$$inline) {
      throw new Error("'target' is a required option");
    }
    super();
    /**
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     *
     * @type {Props}
     */
    __publicField(this, "$$prop_def");
    /**
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     *
     * @type {Events}
     */
    __publicField(this, "$$events_def");
    /**
     * For type checking capabilities only.
     * Does not exist at runtime.
     * ### DO NOT USE!
     *
     * @type {Slots}
     */
    __publicField(this, "$$slot_def");
  }
  /** @returns {void} */
  $destroy() {
    super.$destroy();
    this.$destroy = () => {
      console.warn("Component was already destroyed");
    };
  }
  /** @returns {void} */
  $capture_state() {
  }
  /** @returns {void} */
  $inject_state() {
  }
}
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
function error(value) {
  if (value instanceof Error) {
    return [false, value];
  }
  return [false, new Error(`${value}`)];
}
function ok(value) {
  return [value, false];
}
async function find_all() {
  const response = await fetch("/api/todos");
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`);
  }
  return ok(await response.json());
}
async function add({ description }) {
  const response = await fetch(`/api/todos`, {
    method: "POST",
    body: description,
    headers: {
      "content-type": "text/plain"
    }
  });
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`);
  }
  return ok(await response.json());
}
async function remove({ id }) {
  const response = await fetch(`/api/todos/${id}`, { method: "DELETE" });
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`);
  }
  return ok(true);
}
async function toggle({ id }) {
  const response = await fetch(`/api/todos/${id}/toggle`, { method: "PUT" });
  if (response.status >= 300) {
    return error(`Request failed with status ${response.status}`);
  }
  return ok(await response.json());
}
function get_then_context(ctx) {
  ctx[2] = ctx[4][0];
  ctx[3] = ctx[4][1];
}
const get_default_slot_changes$2 = (dirty) => ({});
const get_default_slot_context$2 = (ctx) => ({ using: { todos: (
  /*todos*/
  ctx[2]
) } });
function create_catch_block$1(ctx) {
  const block = {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_catch_block$1.name,
    type: "catch",
    source: "(1:0) <script>   import { find_all }",
    ctx
  });
  return block;
}
function create_then_block$1(ctx) {
  get_then_context(ctx);
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$2, create_else_block$2];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*error*/
      ctx2[3]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update2(ctx2, dirty) {
      get_then_context(ctx2);
      if_block.p(ctx2, dirty);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_then_block$1.name,
    type: "then",
    source: "(5:39)    {#if error}",
    ctx
  });
  return block;
}
function create_else_block$2(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[1].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[0],
    get_default_slot_context$2
  );
  const block = {
    c: function create() {
      if (default_slot)
        default_slot.c();
    },
    m: function mount(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p: function update2(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        1)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[0],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[0]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[0],
              dirty,
              get_default_slot_changes$2
            ),
            get_default_slot_context$2
          );
        }
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_else_block$2.name,
    type: "else",
    source: "(8:2) {:else}",
    ctx
  });
  return block;
}
function create_if_block$2(ctx) {
  let t_value = (
    /*error*/
    ctx[3].message + ""
  );
  let t;
  const block = {
    c: function create() {
      t = text(t_value);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(t);
      }
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$2.name,
    type: "if",
    source: "(6:2) {#if error}",
    ctx
  });
  return block;
}
function create_pending_block$1(ctx) {
  const block = {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_pending_block$1.name,
    type: "pending",
    source: "(1:0) <script>   import { find_all }",
    ctx
  });
  return block;
}
function create_fragment$4(ctx) {
  let await_block_anchor;
  let current;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block$1,
    then: create_then_block$1,
    catch: create_catch_block$1,
    value: 4,
    blocks: [, , ,]
  };
  handle_promise(find_all(), info);
  const block = {
    c: function create() {
      await_block_anchor = empty();
      info.block.c();
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      insert_dev(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current = true;
    },
    p: function update2(new_ctx, [dirty]) {
      ctx = new_ctx;
      update_await_block_branch(info, ctx, dirty);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(info.block);
      current = true;
    },
    o: function outro(local) {
      for (let i = 0; i < 3; i += 1) {
        const block2 = info.blocks[i];
        transition_out(block2);
      }
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(await_block_anchor);
      }
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$4.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$4($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("Find_all", slots, ["default"]);
  const writable_props = [];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<Find_all> was created with unknown prop '${key}'`);
  });
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(0, $$scope = $$props2.$$scope);
  };
  $$self.$capture_state = () => ({ find_all });
  return [$$scope, slots];
}
class Find_all extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Find_all",
      options,
      id: create_fragment$4.name
    });
  }
}
const file$2 = "src/lib/:pages/home-page.svelte";
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[7] = list[i];
  return child_ctx;
}
function create_each_block(ctx) {
  let div5;
  let div0;
  let input;
  let input_id_value;
  let input_checked_value;
  let t0;
  let label;
  let div2;
  let div1;
  let span0;
  let t1_value = (
    /*todo*/
    ctx[7].description + ""
  );
  let t1;
  let label_for_value;
  let t2;
  let div4;
  let div3;
  let span1;
  let t4;
  let div6;
  let mounted;
  let dispose;
  function change_handler() {
    return (
      /*change_handler*/
      ctx[4](
        /*todo*/
        ctx[7]
      )
    );
  }
  function mouseup_handler_1() {
    return (
      /*mouseup_handler_1*/
      ctx[5](
        /*todo*/
        ctx[7]
      )
    );
  }
  const block = {
    c: function create() {
      div5 = element("div");
      div0 = element("div");
      input = element("input");
      t0 = space();
      label = element("label");
      div2 = element("div");
      div1 = element("div");
      span0 = element("span");
      t1 = text(t1_value);
      t2 = space();
      div4 = element("div");
      div3 = element("div");
      span1 = element("span");
      span1.textContent = "Remove";
      t4 = space();
      div6 = element("div");
      attr_dev(input, "id", input_id_value = /*todo*/
      ctx[7].id);
      attr_dev(input, "type", "checkbox");
      input.checked = input_checked_value = /*todo*/
      ctx[7].checked;
      attr_dev(input, "class", "checkbox mt-2 rounded-full");
      add_location(input, file$2, 33, 10, 896);
      attr_dev(div0, "class", "grid");
      add_location(div0, file$2, 32, 8, 867);
      attr_dev(span0, "class", "p-2");
      add_location(span0, file$2, 47, 14, 1304);
      attr_dev(div1, "class", "btn btn-ghost rounded-3xl grid justify-start");
      add_location(div1, file$2, 46, 12, 1231);
      attr_dev(div2, "class", "grid");
      add_location(div2, file$2, 45, 10, 1200);
      attr_dev(label, "for", label_for_value = /*todo*/
      ctx[7].id);
      add_location(label, file$2, 44, 8, 1168);
      attr_dev(span1, "class", "p-2");
      add_location(span1, file$2, 61, 12, 1742);
      attr_dev(div3, "class", "btn btn-error rounded-3xl grid justify-start");
      add_location(div3, file$2, 54, 10, 1508);
      attr_dev(div4, "class", "grid");
      add_location(div4, file$2, 52, 8, 1410);
      attr_dev(div5, "class", "grid gap-2");
      set_style(div5, "grid-template-columns", "auto 1fr auto");
      add_location(div5, file$2, 31, 6, 789);
      attr_dev(div6, "class", "pt-4");
      add_location(div6, file$2, 65, 6, 1825);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div5, anchor);
      append_dev(div5, div0);
      append_dev(div0, input);
      append_dev(div5, t0);
      append_dev(div5, label);
      append_dev(label, div2);
      append_dev(div2, div1);
      append_dev(div1, span0);
      append_dev(span0, t1);
      append_dev(div5, t2);
      append_dev(div5, div4);
      append_dev(div4, div3);
      append_dev(div3, span1);
      insert_dev(target, t4, anchor);
      insert_dev(target, div6, anchor);
      if (!mounted) {
        dispose = [
          listen_dev(input, "change", change_handler, false, false, false, false),
          listen_dev(div3, "mouseup", mouseup_handler_1, false, false, false, false)
        ];
        mounted = true;
      }
    },
    p: function update2(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*todos*/
      64 && input_id_value !== (input_id_value = /*todo*/
      ctx[7].id)) {
        attr_dev(input, "id", input_id_value);
      }
      if (dirty & /*todos*/
      64 && input_checked_value !== (input_checked_value = /*todo*/
      ctx[7].checked)) {
        prop_dev(input, "checked", input_checked_value);
      }
      if (dirty & /*todos*/
      64 && t1_value !== (t1_value = /*todo*/
      ctx[7].description + ""))
        set_data_dev(t1, t1_value);
      if (dirty & /*todos*/
      64 && label_for_value !== (label_for_value = /*todo*/
      ctx[7].id)) {
        attr_dev(label, "for", label_for_value);
      }
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(div5);
        detach_dev(t4);
        detach_dev(div6);
      }
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block.name,
    type: "each",
    source: "(31:4) {#each todos.data as todo}",
    ctx
  });
  return block;
}
function create_default_slot$1(ctx) {
  let each_1_anchor;
  let each_value = ensure_array_like_dev(
    /*todos*/
    ctx[6].data
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const block = {
    c: function create() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m: function mount(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert_dev(target, each_1_anchor, anchor);
    },
    p: function update2(ctx2, dirty) {
      if (dirty & /*todos, update, Date*/
      66) {
        each_value = ensure_array_like_dev(
          /*todos*/
          ctx2[6].data
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot$1.name,
    type: "slot",
    source: "(30:2) <FindAll let:using={{ todos }}>",
    ctx
  });
  return block;
}
function create_key_block$1(ctx) {
  let findall;
  let current;
  findall = new Find_all({
    props: {
      $$slots: {
        default: [
          create_default_slot$1,
          ({ using: { todos } }) => ({ 6: todos }),
          ({ using: todos_todos }) => todos_todos ? 64 : 0
        ]
      },
      $$scope: { ctx }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(findall.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(findall, target, anchor);
      current = true;
    },
    p: function update2(ctx2, dirty) {
      const findall_changes = {};
      if (dirty & /*$$scope, todos, update*/
      1090) {
        findall_changes.$$scope = { dirty, ctx: ctx2 };
      }
      findall.$set(findall_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(findall.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(findall.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(findall, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_key_block$1.name,
    type: "key",
    source: "(29:0) {#key update}",
    ctx
  });
  return block;
}
function create_fragment$3(ctx) {
  let div1;
  let input;
  let t0;
  let div0;
  let span;
  let t2;
  let div2;
  let t3;
  let previous_key = (
    /*update*/
    ctx[1]
  );
  let key_block_anchor;
  let current;
  let mounted;
  let dispose;
  let key_block = create_key_block$1(ctx);
  const block = {
    c: function create() {
      div1 = element("div");
      input = element("input");
      t0 = space();
      div0 = element("div");
      span = element("span");
      span.textContent = "+ Add";
      t2 = space();
      div2 = element("div");
      t3 = space();
      key_block.c();
      key_block_anchor = empty();
      attr_dev(input, "type", "text");
      attr_dev(input, "placeholder", "Type here");
      attr_dev(input, "class", "input input-bordered w-96 max-w-xs rounded-3xl");
      add_location(input, file$2, 8, 2, 256);
      add_location(span, file$2, 23, 4, 647);
      attr_dev(div0, "class", "w-20 btn btn-ghost rounded-3xl");
      add_location(div0, file$2, 15, 2, 463);
      attr_dev(div1, "class", "grid w-96 gap-2");
      set_style(div1, "grid-template-columns", "auto 1fr");
      add_location(div1, file$2, 7, 0, 183);
      attr_dev(div2, "class", "pt-4");
      add_location(div2, file$2, 26, 0, 682);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      insert_dev(target, div1, anchor);
      append_dev(div1, input);
      set_input_value(
        input,
        /*description*/
        ctx[0]
      );
      append_dev(div1, t0);
      append_dev(div1, div0);
      append_dev(div0, span);
      insert_dev(target, t2, anchor);
      insert_dev(target, div2, anchor);
      insert_dev(target, t3, anchor);
      key_block.m(target, anchor);
      insert_dev(target, key_block_anchor, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          listen_dev(
            input,
            "input",
            /*input_input_handler*/
            ctx[2]
          ),
          listen_dev(
            div0,
            "mouseup",
            /*mouseup_handler*/
            ctx[3],
            false,
            false,
            false,
            false
          )
        ];
        mounted = true;
      }
    },
    p: function update2(ctx2, [dirty]) {
      if (dirty & /*description*/
      1 && input.value !== /*description*/
      ctx2[0]) {
        set_input_value(
          input,
          /*description*/
          ctx2[0]
        );
      }
      if (dirty & /*update*/
      2 && safe_not_equal(previous_key, previous_key = /*update*/
      ctx2[1])) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block$1(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(key_block_anchor.parentNode, key_block_anchor);
      } else {
        key_block.p(ctx2, dirty);
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(key_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(key_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(div1);
        detach_dev(t2);
        detach_dev(div2);
        detach_dev(t3);
        detach_dev(key_block_anchor);
      }
      key_block.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$3.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$3($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("Home_page", slots, []);
  let description = "";
  let update2 = Date.now();
  const writable_props = [];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<Home_page> was created with unknown prop '${key}'`);
  });
  function input_input_handler() {
    description = this.value;
    $$invalidate(0, description);
  }
  const mouseup_handler = async function run2() {
    await add({ description });
    $$invalidate(0, description = "");
    $$invalidate(1, update2 = Date.now());
  };
  const change_handler = function run2(todo) {
    toggle({ id: todo.id });
  };
  const mouseup_handler_1 = async function run2(todo) {
    await remove({ id: todo.id });
    $$invalidate(1, update2 = Date.now());
  };
  $$self.$capture_state = () => ({
    FindAll: Find_all,
    add,
    remove,
    toggle,
    description,
    update: update2
  });
  $$self.$inject_state = ($$props2) => {
    if ("description" in $$props2)
      $$invalidate(0, description = $$props2.description);
    if ("update" in $$props2)
      $$invalidate(1, update2 = $$props2.update);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  return [
    description,
    update2,
    input_input_handler,
    mouseup_handler,
    change_handler,
    mouseup_handler_1
  ];
}
class Home_page extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Home_page",
      options,
      id: create_fragment$3.name
    });
  }
}
const LOCATION = {};
const ROUTER = {};
const HISTORY = {};
const PARAM = /^:(.+)/;
const SEGMENT_POINTS = 4;
const STATIC_POINTS = 3;
const DYNAMIC_POINTS = 2;
const SPLAT_PENALTY = 1;
const ROOT_POINTS = 1;
const segmentize = (uri) => uri.replace(/(^\/+|\/+$)/g, "").split("/");
const stripSlashes = (string) => string.replace(/(^\/+|\/+$)/g, "");
const rankRoute = (route, index) => {
  const score = route.default ? 0 : segmentize(route.path).reduce((score2, segment) => {
    score2 += SEGMENT_POINTS;
    if (segment === "") {
      score2 += ROOT_POINTS;
    } else if (PARAM.test(segment)) {
      score2 += DYNAMIC_POINTS;
    } else if (segment[0] === "*") {
      score2 -= SEGMENT_POINTS + SPLAT_PENALTY;
    } else {
      score2 += STATIC_POINTS;
    }
    return score2;
  }, 0);
  return { route, score, index };
};
const rankRoutes = (routes) => routes.map(rankRoute).sort(
  (a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
);
const pick = (routes, uri) => {
  let match;
  let default_;
  const [uriPathname] = uri.split("?");
  const uriSegments = segmentize(uriPathname);
  const isRootUri = uriSegments[0] === "";
  const ranked = rankRoutes(routes);
  for (let i = 0, l = ranked.length; i < l; i++) {
    const route = ranked[i].route;
    let missed = false;
    if (route.default) {
      default_ = {
        route,
        params: {},
        uri
      };
      continue;
    }
    const routeSegments = segmentize(route.path);
    const params = {};
    const max = Math.max(uriSegments.length, routeSegments.length);
    let index = 0;
    for (; index < max; index++) {
      const routeSegment = routeSegments[index];
      const uriSegment = uriSegments[index];
      if (routeSegment && routeSegment[0] === "*") {
        const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);
        params[splatName] = uriSegments.slice(index).map(decodeURIComponent).join("/");
        break;
      }
      if (typeof uriSegment === "undefined") {
        missed = true;
        break;
      }
      const dynamicMatch = PARAM.exec(routeSegment);
      if (dynamicMatch && !isRootUri) {
        const value = decodeURIComponent(uriSegment);
        params[dynamicMatch[1]] = value;
      } else if (routeSegment !== uriSegment) {
        missed = true;
        break;
      }
    }
    if (!missed) {
      match = {
        route,
        params,
        uri: "/" + uriSegments.slice(0, index).join("/")
      };
      break;
    }
  }
  return match || default_ || null;
};
const combinePaths = (basepath, path) => `${stripSlashes(
  path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
)}/`;
const canUseDOM = () => typeof window !== "undefined" && "document" in window && "location" in window;
const get_default_slot_changes$1 = (dirty) => ({ params: dirty & /*routeParams*/
4 });
const get_default_slot_context$1 = (ctx) => ({ params: (
  /*routeParams*/
  ctx[2]
) });
function create_if_block$1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_1, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*component*/
      ctx2[0]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update2(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block$1.name,
    type: "if",
    source: "(42:0) {#if $activeRoute && $activeRoute.route === route}",
    ctx
  });
  return block;
}
function create_else_block$1(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[8].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[7],
    get_default_slot_context$1
  );
  const block = {
    c: function create() {
      if (default_slot)
        default_slot.c();
    },
    m: function mount(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p: function update2(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, routeParams*/
        132)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[7],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[7]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[7],
              dirty,
              get_default_slot_changes$1
            ),
            get_default_slot_context$1
          );
        }
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_else_block$1.name,
    type: "else",
    source: "(51:4) {:else}",
    ctx
  });
  return block;
}
function create_if_block_1(ctx) {
  let await_block_anchor;
  let promise2;
  let current;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block,
    then: create_then_block,
    catch: create_catch_block,
    value: 12,
    blocks: [, , ,]
  };
  handle_promise(promise2 = /*component*/
  ctx[0], info);
  const block = {
    c: function create() {
      await_block_anchor = empty();
      info.block.c();
    },
    m: function mount(target, anchor) {
      insert_dev(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current = true;
    },
    p: function update2(new_ctx, dirty) {
      ctx = new_ctx;
      info.ctx = ctx;
      if (dirty & /*component*/
      1 && promise2 !== (promise2 = /*component*/
      ctx[0]) && handle_promise(promise2, info))
        ;
      else {
        update_await_block_branch(info, ctx, dirty);
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(info.block);
      current = true;
    },
    o: function outro(local) {
      for (let i = 0; i < 3; i += 1) {
        const block2 = info.blocks[i];
        transition_out(block2);
      }
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(await_block_anchor);
      }
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_1.name,
    type: "if",
    source: "(43:4) {#if component}",
    ctx
  });
  return block;
}
function create_catch_block(ctx) {
  const block = {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_catch_block.name,
    type: "catch",
    source: "(1:0) <script>     import { getContext, onDestroy }",
    ctx
  });
  return block;
}
function create_then_block(ctx) {
  var _a;
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*routeParams*/
    ctx[2],
    /*routeProps*/
    ctx[3]
  ];
  var switch_value = (
    /*resolvedComponent*/
    ((_a = ctx[12]) == null ? void 0 : _a.default) || /*resolvedComponent*/
    ctx[12]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    if (dirty !== void 0 && dirty & /*routeParams, routeProps*/
    12) {
      switch_instance_props = get_spread_update(switch_instance_spread_levels, [
        dirty & /*routeParams*/
        4 && get_spread_object(
          /*routeParams*/
          ctx2[2]
        ),
        dirty & /*routeProps*/
        8 && get_spread_object(
          /*routeProps*/
          ctx2[3]
        )
      ]);
    } else {
      for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
        switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
      }
    }
    return {
      props: switch_instance_props,
      $$inline: true
    };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
  }
  const block = {
    c: function create() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert_dev(target, switch_instance_anchor, anchor);
      current = true;
    },
    p: function update2(ctx2, dirty) {
      var _a2;
      if (dirty & /*component*/
      1 && switch_value !== (switch_value = /*resolvedComponent*/
      ((_a2 = ctx2[12]) == null ? void 0 : _a2.default) || /*resolvedComponent*/
      ctx2[12])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx2, dirty));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty & /*routeParams, routeProps*/
        12 ? get_spread_update(switch_instance_spread_levels, [
          dirty & /*routeParams*/
          4 && get_spread_object(
            /*routeParams*/
            ctx2[2]
          ),
          dirty & /*routeProps*/
          8 && get_spread_object(
            /*routeProps*/
            ctx2[3]
          )
        ]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i: function intro(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(switch_instance_anchor);
      }
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_then_block.name,
    type: "then",
    source: "(44:49)              <svelte:component                 this={resolvedComponent?.default || resolvedComponent}",
    ctx
  });
  return block;
}
function create_pending_block(ctx) {
  const block = {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_pending_block.name,
    type: "pending",
    source: "(1:0) <script>     import { getContext, onDestroy }",
    ctx
  });
  return block;
}
function create_fragment$2(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*$activeRoute*/
    ctx[1] && /*$activeRoute*/
    ctx[1].route === /*route*/
    ctx[5] && create_if_block$1(ctx)
  );
  const block = {
    c: function create() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update2(ctx2, [dirty]) {
      if (
        /*$activeRoute*/
        ctx2[1] && /*$activeRoute*/
        ctx2[1].route === /*route*/
        ctx2[5]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*$activeRoute*/
          2) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block$1(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$2.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$2($$self, $$props, $$invalidate) {
  let $activeRoute;
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("Route", slots, ["default"]);
  let { path = "" } = $$props;
  let { component = null } = $$props;
  let routeParams = {};
  let routeProps = {};
  const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
  validate_store(activeRoute, "activeRoute");
  component_subscribe($$self, activeRoute, (value) => $$invalidate(1, $activeRoute = value));
  const route = {
    path,
    // If no path prop is given, this Route will act as the default Route
    // that is rendered if no other Route in the Router is a match.
    default: path === ""
  };
  registerRoute(route);
  onDestroy(() => {
    unregisterRoute(route);
  });
  $$self.$$set = ($$new_props) => {
    $$invalidate(11, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    if ("path" in $$new_props)
      $$invalidate(6, path = $$new_props.path);
    if ("component" in $$new_props)
      $$invalidate(0, component = $$new_props.component);
    if ("$$scope" in $$new_props)
      $$invalidate(7, $$scope = $$new_props.$$scope);
  };
  $$self.$capture_state = () => ({
    getContext,
    onDestroy,
    ROUTER,
    canUseDOM,
    path,
    component,
    routeParams,
    routeProps,
    registerRoute,
    unregisterRoute,
    activeRoute,
    route,
    $activeRoute
  });
  $$self.$inject_state = ($$new_props) => {
    $$invalidate(11, $$props = assign(assign({}, $$props), $$new_props));
    if ("path" in $$props)
      $$invalidate(6, path = $$new_props.path);
    if ("component" in $$props)
      $$invalidate(0, component = $$new_props.component);
    if ("routeParams" in $$props)
      $$invalidate(2, routeParams = $$new_props.routeParams);
    if ("routeProps" in $$props)
      $$invalidate(3, routeProps = $$new_props.routeProps);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$self.$$.update = () => {
    if ($activeRoute && $activeRoute.route === route) {
      $$invalidate(2, routeParams = $activeRoute.params);
      const { component: c, path: path2, ...rest } = $$props;
      $$invalidate(3, routeProps = rest);
      if (c) {
        if (c.toString().startsWith("class "))
          $$invalidate(0, component = c);
        else
          $$invalidate(0, component = c());
      }
      canUseDOM() && !$activeRoute.preserveScroll && (window == null ? void 0 : window.scrollTo(0, 0));
    }
  };
  $$props = exclude_internal_props($$props);
  return [
    component,
    $activeRoute,
    routeParams,
    routeProps,
    activeRoute,
    route,
    path,
    $$scope,
    slots
  ];
}
class Route extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$2, create_fragment$2, safe_not_equal, { path: 6, component: 0 });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Route",
      options,
      id: create_fragment$2.name
    });
  }
  get path() {
    throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set path(value) {
    throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get component() {
    throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set component(value) {
    throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
const subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update2) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function derived(stores, fn, initial_value) {
  const single = !Array.isArray(stores);
  const stores_array = single ? [stores] : stores;
  if (!stores_array.every(Boolean)) {
    throw new Error("derived() expects stores as input, got a falsy value");
  }
  const auto = fn.length < 2;
  return readable(initial_value, (set, update2) => {
    let started = false;
    const values = [];
    let pending = 0;
    let cleanup = noop;
    const sync = () => {
      if (pending) {
        return;
      }
      cleanup();
      const result = fn(single ? values[0] : values, set, update2);
      if (auto) {
        set(result);
      } else {
        cleanup = is_function(result) ? result : noop;
      }
    };
    const unsubscribers = stores_array.map(
      (store, i) => subscribe(
        store,
        (value) => {
          values[i] = value;
          pending &= ~(1 << i);
          if (started) {
            sync();
          }
        },
        () => {
          pending |= 1 << i;
        }
      )
    );
    started = true;
    sync();
    return function stop() {
      run_all(unsubscribers);
      cleanup();
      started = false;
    };
  });
}
const getLocation = (source) => {
  return {
    ...source.location,
    state: source.history.state,
    key: source.history.state && source.history.state.key || "initial"
  };
};
const createHistory = (source) => {
  const listeners = [];
  let location = getLocation(source);
  return {
    get location() {
      return location;
    },
    listen(listener) {
      listeners.push(listener);
      const popstateListener = () => {
        location = getLocation(source);
        listener({ location, action: "POP" });
      };
      source.addEventListener("popstate", popstateListener);
      return () => {
        source.removeEventListener("popstate", popstateListener);
        const index = listeners.indexOf(listener);
        listeners.splice(index, 1);
      };
    },
    navigate(to, { state, replace = false, preserveScroll = false } = {}) {
      state = { ...state, key: Date.now() + "" };
      try {
        if (replace)
          source.history.replaceState(state, "", to);
        else
          source.history.pushState(state, "", to);
      } catch (e) {
        source.location[replace ? "replace" : "assign"](to);
      }
      location = getLocation(source);
      listeners.forEach(
        (listener) => listener({ location, action: "PUSH", preserveScroll })
      );
      document.activeElement.blur();
    }
  };
};
const createMemorySource = (initialPathname = "/") => {
  let index = 0;
  const stack = [{ pathname: initialPathname, search: "" }];
  const states = [];
  return {
    get location() {
      return stack[index];
    },
    addEventListener(name, fn) {
    },
    removeEventListener(name, fn) {
    },
    history: {
      get entries() {
        return stack;
      },
      get index() {
        return index;
      },
      get state() {
        return states[index];
      },
      pushState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        index++;
        stack.push({ pathname, search });
        states.push(state);
      },
      replaceState(state, _, uri) {
        const [pathname, search = ""] = uri.split("?");
        stack[index] = { pathname, search };
        states[index] = state;
      }
    }
  };
};
const globalHistory = createHistory(
  canUseDOM() ? window : createMemorySource()
);
const { Object: Object_1 } = globals;
const file$1 = "node_modules/svelte-routing/src/Router.svelte";
const get_default_slot_changes_1 = (dirty) => ({
  route: dirty & /*$activeRoute*/
  4,
  location: dirty & /*$location*/
  2
});
const get_default_slot_context_1 = (ctx) => ({
  route: (
    /*$activeRoute*/
    ctx[2] && /*$activeRoute*/
    ctx[2].uri
  ),
  location: (
    /*$location*/
    ctx[1]
  )
});
const get_default_slot_changes = (dirty) => ({
  route: dirty & /*$activeRoute*/
  4,
  location: dirty & /*$location*/
  2
});
const get_default_slot_context = (ctx) => ({
  route: (
    /*$activeRoute*/
    ctx[2] && /*$activeRoute*/
    ctx[2].uri
  ),
  location: (
    /*$location*/
    ctx[1]
  )
});
function create_else_block(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[15].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[14],
    get_default_slot_context_1
  );
  const block = {
    c: function create() {
      if (default_slot)
        default_slot.c();
    },
    m: function mount(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p: function update2(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/
        16390)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[14],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[14]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[14],
              dirty,
              get_default_slot_changes_1
            ),
            get_default_slot_context_1
          );
        }
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_else_block.name,
    type: "else",
    source: "(141:0) {:else}",
    ctx
  });
  return block;
}
function create_if_block(ctx) {
  let previous_key = (
    /*$location*/
    ctx[1].pathname
  );
  let key_block_anchor;
  let current;
  let key_block = create_key_block(ctx);
  const block = {
    c: function create() {
      key_block.c();
      key_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      key_block.m(target, anchor);
      insert_dev(target, key_block_anchor, anchor);
      current = true;
    },
    p: function update2(ctx2, dirty) {
      if (dirty & /*$location*/
      2 && safe_not_equal(previous_key, previous_key = /*$location*/
      ctx2[1].pathname)) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(key_block_anchor.parentNode, key_block_anchor);
      } else {
        key_block.p(ctx2, dirty);
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(key_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(key_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(key_block_anchor);
      }
      key_block.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block.name,
    type: "if",
    source: "(132:0) {#if viewtransition}",
    ctx
  });
  return block;
}
function create_key_block(ctx) {
  let div;
  let div_intro;
  let div_outro;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[15].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[14],
    get_default_slot_context
  );
  const block = {
    c: function create() {
      div = element("div");
      if (default_slot)
        default_slot.c();
      add_location(div, file$1, 133, 8, 4613);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p: function update2(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, $activeRoute, $location*/
        16390)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[14],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[14]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[14],
              dirty,
              get_default_slot_changes
            ),
            get_default_slot_context
          );
        }
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      if (local) {
        add_render_callback(() => {
          if (!current)
            return;
          if (div_outro)
            div_outro.end(1);
          div_intro = create_in_transition(
            div,
            /*viewtransitionFn*/
            ctx[3],
            {}
          );
          div_intro.start();
        });
      }
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      if (div_intro)
        div_intro.invalidate();
      if (local) {
        div_outro = create_out_transition(
          div,
          /*viewtransitionFn*/
          ctx[3],
          {}
        );
      }
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(div);
      }
      if (default_slot)
        default_slot.d(detaching);
      if (detaching && div_outro)
        div_outro.end();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_key_block.name,
    type: "key",
    source: "(133:4) {#key $location.pathname}",
    ctx
  });
  return block;
}
function create_fragment$1(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*viewtransition*/
      ctx2[0]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update2(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment$1.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance$1($$self, $$props, $$invalidate) {
  let $location;
  let $routes;
  let $base;
  let $activeRoute;
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("Router", slots, ["default"]);
  let { basepath = "/" } = $$props;
  let { url = null } = $$props;
  let { viewtransition = null } = $$props;
  let { history = globalHistory } = $$props;
  const viewtransitionFn = (node, _, direction) => {
    const vt = viewtransition(direction);
    if (typeof (vt == null ? void 0 : vt.fn) === "function")
      return vt.fn(node, vt);
    else
      return vt;
  };
  setContext(HISTORY, history);
  const locationContext = getContext(LOCATION);
  const routerContext = getContext(ROUTER);
  const routes = writable([]);
  validate_store(routes, "routes");
  component_subscribe($$self, routes, (value) => $$invalidate(12, $routes = value));
  const activeRoute = writable(null);
  validate_store(activeRoute, "activeRoute");
  component_subscribe($$self, activeRoute, (value) => $$invalidate(2, $activeRoute = value));
  let hasActiveRoute = false;
  const location = locationContext || writable(url ? { pathname: url } : history.location);
  validate_store(location, "location");
  component_subscribe($$self, location, (value) => $$invalidate(1, $location = value));
  const base = routerContext ? routerContext.routerBase : writable({ path: basepath, uri: basepath });
  validate_store(base, "base");
  component_subscribe($$self, base, (value) => $$invalidate(13, $base = value));
  const routerBase = derived([base, activeRoute], ([base2, activeRoute2]) => {
    if (!activeRoute2)
      return base2;
    const { path: basepath2 } = base2;
    const { route, uri } = activeRoute2;
    const path = route.default ? basepath2 : route.path.replace(/\*.*$/, "");
    return { path, uri };
  });
  const registerRoute = (route) => {
    const { path: basepath2 } = $base;
    let { path } = route;
    route._path = path;
    route.path = combinePaths(basepath2, path);
    if (typeof window === "undefined") {
      if (hasActiveRoute)
        return;
      const matchingRoute = pick([route], $location.pathname);
      if (matchingRoute) {
        activeRoute.set(matchingRoute);
        hasActiveRoute = true;
      }
    } else {
      routes.update((rs) => [...rs, route]);
    }
  };
  const unregisterRoute = (route) => {
    routes.update((rs) => rs.filter((r) => r !== route));
  };
  let preserveScroll = false;
  if (!locationContext) {
    onMount(() => {
      const unlisten = history.listen((event) => {
        $$invalidate(11, preserveScroll = event.preserveScroll || false);
        location.set(event.location);
      });
      return unlisten;
    });
    setContext(LOCATION, location);
  }
  setContext(ROUTER, {
    activeRoute,
    base,
    routerBase,
    registerRoute,
    unregisterRoute
  });
  const writable_props = ["basepath", "url", "viewtransition", "history"];
  Object_1.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<Router> was created with unknown prop '${key}'`);
  });
  $$self.$$set = ($$props2) => {
    if ("basepath" in $$props2)
      $$invalidate(8, basepath = $$props2.basepath);
    if ("url" in $$props2)
      $$invalidate(9, url = $$props2.url);
    if ("viewtransition" in $$props2)
      $$invalidate(0, viewtransition = $$props2.viewtransition);
    if ("history" in $$props2)
      $$invalidate(10, history = $$props2.history);
    if ("$$scope" in $$props2)
      $$invalidate(14, $$scope = $$props2.$$scope);
  };
  $$self.$capture_state = () => ({
    getContext,
    onMount,
    setContext,
    derived,
    writable,
    HISTORY,
    LOCATION,
    ROUTER,
    globalHistory,
    combinePaths,
    pick,
    basepath,
    url,
    viewtransition,
    history,
    viewtransitionFn,
    locationContext,
    routerContext,
    routes,
    activeRoute,
    hasActiveRoute,
    location,
    base,
    routerBase,
    registerRoute,
    unregisterRoute,
    preserveScroll,
    $location,
    $routes,
    $base,
    $activeRoute
  });
  $$self.$inject_state = ($$props2) => {
    if ("basepath" in $$props2)
      $$invalidate(8, basepath = $$props2.basepath);
    if ("url" in $$props2)
      $$invalidate(9, url = $$props2.url);
    if ("viewtransition" in $$props2)
      $$invalidate(0, viewtransition = $$props2.viewtransition);
    if ("history" in $$props2)
      $$invalidate(10, history = $$props2.history);
    if ("hasActiveRoute" in $$props2)
      hasActiveRoute = $$props2.hasActiveRoute;
    if ("preserveScroll" in $$props2)
      $$invalidate(11, preserveScroll = $$props2.preserveScroll);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$base*/
    8192) {
      {
        const { path: basepath2 } = $base;
        routes.update((rs) => rs.map((r) => Object.assign(r, { path: combinePaths(basepath2, r._path) })));
      }
    }
    if ($$self.$$.dirty & /*$routes, $location, preserveScroll*/
    6146) {
      {
        const bestMatch = pick($routes, $location.pathname);
        activeRoute.set({ ...bestMatch, preserveScroll });
      }
    }
  };
  return [
    viewtransition,
    $location,
    $activeRoute,
    viewtransitionFn,
    routes,
    activeRoute,
    location,
    base,
    basepath,
    url,
    history,
    preserveScroll,
    $routes,
    $base,
    $$scope,
    slots
  ];
}
class Router extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      basepath: 8,
      url: 9,
      viewtransition: 0,
      history: 10
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Router",
      options,
      id: create_fragment$1.name
    });
  }
  get basepath() {
    throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set basepath(value) {
    throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get url() {
    throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set url(value) {
    throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get viewtransition() {
    throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set viewtransition(value) {
    throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get history() {
    throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set history(value) {
    throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
}
const file = "src/main.svelte";
function create_default_slot_1(ctx) {
  let homepage;
  let current;
  homepage = new Home_page({ $$inline: true });
  const block = {
    c: function create() {
      create_component(homepage.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(homepage, target, anchor);
      current = true;
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(homepage.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(homepage.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(homepage, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_1.name,
    type: "slot",
    source: '(8:4) <Route path=\\"*\\">',
    ctx
  });
  return block;
}
function create_default_slot(ctx) {
  let route;
  let current;
  route = new Route({
    props: {
      path: "*",
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      create_component(route.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(route, target, anchor);
      current = true;
    },
    p: function update2(ctx2, dirty) {
      const route_changes = {};
      if (dirty & /*$$scope*/
      1) {
        route_changes.$$scope = { dirty, ctx: ctx2 };
      }
      route.$set(route_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(route.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(route.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(route, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot.name,
    type: "slot",
    source: "(7:2) <Router>",
    ctx
  });
  return block;
}
function create_fragment(ctx) {
  let div;
  let router;
  let current;
  router = new Router({
    props: {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    },
    $$inline: true
  });
  const block = {
    c: function create() {
      div = element("div");
      create_component(router.$$.fragment);
      attr_dev(div, "class", "grid justify-center content-center h-full w-full");
      add_location(div, file, 5, 0, 118);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      mount_component(router, div, null);
      current = true;
    },
    p: function update2(ctx2, [dirty]) {
      const router_changes = {};
      if (dirty & /*$$scope*/
      1) {
        router_changes.$$scope = { dirty, ctx: ctx2 };
      }
      router.$set(router_changes);
    },
    i: function intro(local) {
      if (current)
        return;
      transition_in(router.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(router.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(div);
      }
      destroy_component(router);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
function instance($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("Main", slots, []);
  const writable_props = [];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot")
      console.warn(`<Main> was created with unknown prop '${key}'`);
  });
  $$self.$capture_state = () => ({ HomePage: Home_page, Route, Router });
  return [];
}
class Main extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "Main",
      options,
      id: create_fragment.name
    });
  }
}
new Main({
  target: document.getElementById("main")
});
//# sourceMappingURL=index.js.map
