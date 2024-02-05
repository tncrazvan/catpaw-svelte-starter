var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
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
function get_store_value(store) {
  let value;
  subscribe(store, (_) => value = _)();
  return value;
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
function set_store_value(store, ret, value) {
  store.set(value);
  return ret;
}
function split_css_unit(value) {
  const split = typeof value === "string" && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
  return split ? [parseFloat(split[1]), split[2] || "px"] : [
    /** @type {number} */
    value,
    "px"
  ];
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
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
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
function set_data(text2, data) {
  data = "" + data;
  if (text2.data === data)
    return;
  text2.data = /** @type {string} */
  data;
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
function toggle_class(element2, name, toggle2) {
  element2.classList.toggle(name, !!toggle2);
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  return new CustomEvent(type, { detail, bubbles, cancelable });
}
function construct_svelte_component(component, props) {
  return new component(props);
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
function create_rule(node, a, b, duration, delay2, ease, fn, uid = 0) {
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
  node.style.animation = `${animation ? `${animation}, ` : ""}${name} ${duration}ms linear ${delay2}ms 1 both`;
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
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(
        /** @type {string} */
        type,
        detail,
        { cancelable }
      );
      callbacks.slice().forEach((fn) => {
        fn.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
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
function tick() {
  schedule_update();
  return resolved_promise;
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
  function go2() {
    const {
      delay: delay2 = 0,
      duration = 300,
      easing = identity,
      tick: tick2 = noop,
      css
    } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 0, 1, duration, delay2, easing, css, uid++);
    tick2(0, 1);
    const start_time = now() + delay2;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick2(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick2(t, 1 - t);
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
        wait().then(go2);
      } else {
        go2();
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
  function go2() {
    const {
      delay: delay2 = 0,
      duration = 300,
      easing = identity,
      tick: tick2 = noop,
      css
    } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 1, 0, duration, delay2, easing, css);
    const start_time = now() + delay2;
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
          tick2(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t = easing((now2 - start_time) / duration);
          tick2(1 - t, t);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config(options);
      go2();
    });
  } else {
    go2();
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
const PUBLIC_VERSION = "4";
if (typeof window !== "undefined")
  (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(PUBLIC_VERSION);
const subscriber_queue = [];
function readable(value, start3) {
  return {
    subscribe: writable(value, start3).subscribe
  };
}
function writable(value, start3 = noop) {
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
  function subscribe2(run7, invalidate = noop) {
    const subscriber = [run7, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start3(set, update2) || noop;
    }
    run7(value);
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
const main = document.getElementById("main");
const store_width = readable(main.offsetWidth, function start(set) {
  const timer = setInterval(function run7() {
    set(main.offsetWidth);
  }, 100);
  return function stop() {
    clearInterval(timer);
  };
});
const store_layout = derived(
  store_width,
  function start2($store_width, set) {
    if ($store_width < 1280) {
      set("smaller");
    } else if ($store_width < 1450) {
      set("small");
    } else {
      set("large");
    }
  }
);
function close() {
  message.set(false);
}
function create_message_listener() {
  const message2 = writable(false);
  let timeout = false;
  message2.subscribe(function watch2($message) {
    if (!$message) {
      return;
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function run7() {
      if ($message.on_expire) {
        $message.on_expire({ close });
      }
      timeout = false;
    }, $message.duration);
  });
  return message2;
}
const message = create_message_listener();
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function fly(node, { delay: delay2 = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
  const style2 = getComputedStyle(node);
  const target_opacity = +style2.opacity;
  const transform = style2.transform === "none" ? "" : style2.transform;
  const od = target_opacity * (1 - opacity);
  const [xValue, xUnit] = split_css_unit(x);
  const [yValue, yUnit] = split_css_unit(y);
  return {
    delay: delay2,
    duration,
    easing,
    css: (t, u) => `
            transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
            opacity: ${target_opacity - od * u}`
  };
}
var mdiBug = "M14,12H10V10H14M14,16H10V14H14M20,8H17.19C16.74,7.22 16.12,6.55 15.37,6.04L17,4.41L15.59,3L13.42,5.17C12.96,5.06 12.5,5 12,5C11.5,5 11.04,5.06 10.59,5.17L8.41,3L7,4.41L8.62,6.04C7.88,6.55 7.26,7.22 6.81,8H4V10H6.09C6.04,10.33 6,10.66 6,11V12H4V14H6V15C6,15.34 6.04,15.67 6.09,16H4V18H6.81C7.85,19.79 9.78,21 12,21C14.22,21 16.15,19.79 17.19,18H20V16H17.91C17.96,15.67 18,15.34 18,15V14H20V12H18V11C18,10.66 17.96,10.33 17.91,10H20V8Z";
var mdiExclamation = "M 11,4L 13,4L 13,15L 11,15L 11,4 Z M 13,18L 13,20L 11,20L 11,18L 13,18 Z";
var mdiInformation = "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
function create_else_block$4(ctx) {
  let svg;
  let path_1;
  return {
    c() {
      svg = svg_element("svg");
      path_1 = svg_element("path");
      attr(path_1, "stroke-linecap", "round");
      attr(path_1, "stroke-linejoin", "round");
      attr(path_1, "stroke-width", "1");
      attr(
        path_1,
        "d",
        /*path*/
        ctx[0]
      );
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      set_style(
        svg,
        "width",
        /*size*/
        ctx[1]
      );
      set_style(
        svg,
        "height",
        /*size*/
        ctx[1]
      );
      attr(
        svg,
        "fill",
        /*color_inner*/
        ctx[2]
      );
      attr(svg, "viewBox", "0 0 24 24");
      attr(
        svg,
        "stroke",
        /*color_outer*/
        ctx[3]
      );
      toggle_class(
        svg,
        "opacity-50",
        /*seethrough*/
        ctx[4]
      );
    },
    m(target, anchor) {
      insert(target, svg, anchor);
      append(svg, path_1);
    },
    p(ctx2, dirty) {
      if (dirty & /*path*/
      1) {
        attr(
          path_1,
          "d",
          /*path*/
          ctx2[0]
        );
      }
      if (dirty & /*size*/
      2) {
        set_style(
          svg,
          "width",
          /*size*/
          ctx2[1]
        );
      }
      if (dirty & /*size*/
      2) {
        set_style(
          svg,
          "height",
          /*size*/
          ctx2[1]
        );
      }
      if (dirty & /*color_inner*/
      4) {
        attr(
          svg,
          "fill",
          /*color_inner*/
          ctx2[2]
        );
      }
      if (dirty & /*color_outer*/
      8) {
        attr(
          svg,
          "stroke",
          /*color_outer*/
          ctx2[3]
        );
      }
      if (dirty & /*seethrough*/
      16) {
        toggle_class(
          svg,
          "opacity-50",
          /*seethrough*/
          ctx2[4]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(svg);
      }
    }
  };
}
function create_if_block$7(ctx) {
  let div;
  let span;
  let svg;
  let path_1;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      span = element("span");
      svg = svg_element("svg");
      path_1 = svg_element("path");
      attr(path_1, "stroke-linecap", "round");
      attr(path_1, "stroke-linejoin", "round");
      attr(path_1, "stroke-width", "1");
      attr(
        path_1,
        "d",
        /*path*/
        ctx[0]
      );
      attr(svg, "xmlns", "http://www.w3.org/2000/svg");
      set_style(
        svg,
        "width",
        /*size*/
        ctx[1]
      );
      set_style(
        svg,
        "height",
        /*size*/
        ctx[1]
      );
      attr(
        svg,
        "fill",
        /*color_inner*/
        ctx[2]
      );
      attr(svg, "viewBox", "0 0 24 24");
      attr(
        svg,
        "stroke",
        /*color_outer*/
        ctx[3]
      );
      toggle_class(
        svg,
        "opacity-50",
        /*seethrough*/
        ctx[4]
      );
      attr(span, "class", "text-center cursor-pointer rounded-full hover:bg-base-300 hover:bg-opacity-50 transition-all p-4 ");
      attr(div, "class", "grid items-center");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, span);
      append(span, svg);
      append(svg, path_1);
      if (!mounted) {
        dispose = listen(
          span,
          "mouseup",
          /*mouseup_handler*/
          ctx[7]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty & /*path*/
      1) {
        attr(
          path_1,
          "d",
          /*path*/
          ctx2[0]
        );
      }
      if (dirty & /*size*/
      2) {
        set_style(
          svg,
          "width",
          /*size*/
          ctx2[1]
        );
      }
      if (dirty & /*size*/
      2) {
        set_style(
          svg,
          "height",
          /*size*/
          ctx2[1]
        );
      }
      if (dirty & /*color_inner*/
      4) {
        attr(
          svg,
          "fill",
          /*color_inner*/
          ctx2[2]
        );
      }
      if (dirty & /*color_outer*/
      8) {
        attr(
          svg,
          "stroke",
          /*color_outer*/
          ctx2[3]
        );
      }
      if (dirty & /*seethrough*/
      16) {
        toggle_class(
          svg,
          "opacity-50",
          /*seethrough*/
          ctx2[4]
        );
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$b(ctx) {
  let if_block_anchor;
  function select_block_type(ctx2, dirty) {
    if (
      /*interactive*/
      ctx2[5]
    )
      return create_if_block$7;
    return create_else_block$4;
  }
  let current_block_type = select_block_type(ctx);
  let if_block = current_block_type(ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (current_block_type === (current_block_type = select_block_type(ctx2)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_block.d(detaching);
    }
  };
}
function instance$9($$self, $$props, $$invalidate) {
  let { path } = $$props;
  let { size = "1.6rem" } = $$props;
  let { color_inner = "currentColor" } = $$props;
  let { color_outer = "none" } = $$props;
  let { seethrough = false } = $$props;
  let { interactive = false } = $$props;
  const emit = createEventDispatcher();
  const mouseup_handler = function run7() {
    emit("activate");
  };
  $$self.$$set = ($$props2) => {
    if ("path" in $$props2)
      $$invalidate(0, path = $$props2.path);
    if ("size" in $$props2)
      $$invalidate(1, size = $$props2.size);
    if ("color_inner" in $$props2)
      $$invalidate(2, color_inner = $$props2.color_inner);
    if ("color_outer" in $$props2)
      $$invalidate(3, color_outer = $$props2.color_outer);
    if ("seethrough" in $$props2)
      $$invalidate(4, seethrough = $$props2.seethrough);
    if ("interactive" in $$props2)
      $$invalidate(5, interactive = $$props2.interactive);
  };
  return [
    path,
    size,
    color_inner,
    color_outer,
    seethrough,
    interactive,
    emit,
    mouseup_handler
  ];
}
class Icon extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$9, create_fragment$b, safe_not_equal, {
      path: 0,
      size: 1,
      color_inner: 2,
      color_outer: 3,
      seethrough: 4,
      interactive: 5
    });
  }
}
const badge_svelte_svelte_type_style_lang = "";
function create_if_block_4$2(ctx) {
  let icon;
  let current;
  icon = new Icon({
    props: { path: mdiBug, size: (
      /*icon_size*/
      ctx[5]
    ) }
  });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_size*/
      32)
        icon_changes.size = /*icon_size*/
        ctx2[5];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_if_block_3$2(ctx) {
  let icon;
  let current;
  icon = new Icon({
    props: {
      path: mdiExclamation,
      size: (
        /*icon_size*/
        ctx[5]
      )
    }
  });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_size*/
      32)
        icon_changes.size = /*icon_size*/
        ctx2[5];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_if_block_2$2(ctx) {
  let icon;
  let current;
  icon = new Icon({
    props: {
      path: mdiInformation,
      size: (
        /*icon_size*/
        ctx[5]
      )
    }
  });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_size*/
      32)
        icon_changes.size = /*icon_size*/
        ctx2[5];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_if_block_1$4(ctx) {
  let icon;
  let current;
  icon = new Icon({
    props: {
      path: mdiInformation,
      size: (
        /*icon_size*/
        ctx[5]
      )
    }
  });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_size*/
      32)
        icon_changes.size = /*icon_size*/
        ctx2[5];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_if_block$6(ctx) {
  let icon;
  let current;
  icon = new Icon({
    props: {
      path: (
        /*icon_path*/
        ctx[1]
      ),
      size: (
        /*icon_size*/
        ctx[5]
      )
    }
  });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      2)
        icon_changes.path = /*icon_path*/
        ctx2[1];
      if (dirty & /*icon_size*/
      32)
        icon_changes.size = /*icon_size*/
        ctx2[5];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_fragment$a(ctx) {
  let div;
  let current_block_type_index;
  let if_block;
  let t0;
  let span;
  let t1;
  let current;
  const if_block_creators = [
    create_if_block$6,
    create_if_block_1$4,
    create_if_block_2$2,
    create_if_block_3$2,
    create_if_block_4$2
  ];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*icon_path*/
      ctx2[1]
    )
      return 0;
    if ("base" === /*variant*/
    ctx2[4])
      return 1;
    if ("information" === /*variant*/
    ctx2[4])
      return 2;
    if ("warning" === /*variant*/
    ctx2[4])
      return 3;
    if ("error" === /*variant*/
    ctx2[4])
      return 4;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      div = element("div");
      if (if_block)
        if_block.c();
      t0 = space();
      span = element("span");
      t1 = text(
        /*text*/
        ctx[0]
      );
      attr(span, "class", "svelte-9e0fn8");
      toggle_class(
        span,
        "small",
        /*small*/
        ctx[2]
      );
      toggle_class(
        span,
        "smaller",
        /*smaller*/
        ctx[3]
      );
      toggle_class(span, "text-base", "base" === /*variant*/
      ctx[4]);
      toggle_class(span, "text-error", "error" === /*variant*/
      ctx[4]);
      toggle_class(span, "text-warning", "warning" === /*variant*/
      ctx[4]);
      toggle_class(span, "text-info", "information" === /*variant*/
      ctx[4]);
      attr(div, "class", "badge badge-super badge-outline bg-base-100 svelte-9e0fn8");
      toggle_class(
        div,
        "small",
        /*small*/
        ctx[2]
      );
      toggle_class(
        div,
        "smaller",
        /*smaller*/
        ctx[3]
      );
      toggle_class(div, "badge-base", "base" === /*variant*/
      ctx[4]);
      toggle_class(div, "badge-error", "error" === /*variant*/
      ctx[4]);
      toggle_class(div, "badge-warning", "warning" === /*variant*/
      ctx[4]);
      toggle_class(div, "badge-info", "information" === /*variant*/
      ctx[4]);
      toggle_class(div, "badge-success", "success" === /*variant*/
      ctx[4]);
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div, null);
      }
      append(div, t0);
      append(div, span);
      append(span, t1);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(div, t0);
        } else {
          if_block = null;
        }
      }
      if (!current || dirty & /*text*/
      1)
        set_data(
          t1,
          /*text*/
          ctx2[0]
        );
      if (!current || dirty & /*small*/
      4) {
        toggle_class(
          span,
          "small",
          /*small*/
          ctx2[2]
        );
      }
      if (!current || dirty & /*smaller*/
      8) {
        toggle_class(
          span,
          "smaller",
          /*smaller*/
          ctx2[3]
        );
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(span, "text-base", "base" === /*variant*/
        ctx2[4]);
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(span, "text-error", "error" === /*variant*/
        ctx2[4]);
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(span, "text-warning", "warning" === /*variant*/
        ctx2[4]);
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(span, "text-info", "information" === /*variant*/
        ctx2[4]);
      }
      if (!current || dirty & /*small*/
      4) {
        toggle_class(
          div,
          "small",
          /*small*/
          ctx2[2]
        );
      }
      if (!current || dirty & /*smaller*/
      8) {
        toggle_class(
          div,
          "smaller",
          /*smaller*/
          ctx2[3]
        );
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(div, "badge-base", "base" === /*variant*/
        ctx2[4]);
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(div, "badge-error", "error" === /*variant*/
        ctx2[4]);
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(div, "badge-warning", "warning" === /*variant*/
        ctx2[4]);
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(div, "badge-info", "information" === /*variant*/
        ctx2[4]);
      }
      if (!current || dirty & /*variant*/
      16) {
        toggle_class(div, "badge-success", "success" === /*variant*/
        ctx2[4]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let { text: text2 } = $$props;
  let { icon_path = "" } = $$props;
  let { small = false } = $$props;
  let { smaller = false } = $$props;
  let { variant = "base" } = $$props;
  let icon_size = "1.2rem";
  $$self.$$set = ($$props2) => {
    if ("text" in $$props2)
      $$invalidate(0, text2 = $$props2.text);
    if ("icon_path" in $$props2)
      $$invalidate(1, icon_path = $$props2.icon_path);
    if ("small" in $$props2)
      $$invalidate(2, small = $$props2.small);
    if ("smaller" in $$props2)
      $$invalidate(3, smaller = $$props2.smaller);
    if ("variant" in $$props2)
      $$invalidate(4, variant = $$props2.variant);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*smaller, small*/
    12) {
      if (!smaller && small) {
        $$invalidate(5, icon_size = `0.7rem`);
      }
    }
    if ($$self.$$.dirty & /*smaller*/
    8) {
      if (smaller) {
        $$invalidate(5, icon_size = `0.5rem`);
      }
    }
  };
  return [text2, icon_path, small, smaller, variant, icon_size];
}
class Badge extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$8, create_fragment$a, safe_not_equal, {
      text: 0,
      icon_path: 1,
      small: 2,
      smaller: 3,
      variant: 4
    });
  }
}
const center_svelte_svelte_type_style_lang = "";
function create_if_block_8$1(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-ebd justify-self-end svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center content-end justify-end svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_7$1(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-ebd justify-self-start svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center content-end justify-start svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_6$1(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-start justify-self-end svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center content-start justify-end svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_5$1(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-start justify-self-start svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center content-start justify-start svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_4$1(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-center justify-self-end svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center content-center justify-end svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_3$1(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-center justify-self-start svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center content-center justify-start svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_2$1(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-start justify-self-center svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center content-start justify-center svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_1$3(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-end justify-self-center svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center content-end justify-center svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block$5(ctx) {
  let div1;
  let div0;
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (default_slot)
        default_slot.c();
      attr(div0, "class", "wrapper self-center justify-self-center svelte-1xb58c7");
      toggle_class(
        div0,
        "expand",
        /*expand*/
        ctx[0]
      );
      attr(div1, "class", "center self-center content-center justify-center svelte-1xb58c7");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (default_slot) {
        default_slot.m(div0, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
      if (!current || dirty & /*expand*/
      1) {
        toggle_class(
          div0,
          "expand",
          /*expand*/
          ctx2[0]
        );
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
      }
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_fragment$9(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [
    create_if_block$5,
    create_if_block_1$3,
    create_if_block_2$1,
    create_if_block_3$1,
    create_if_block_4$1,
    create_if_block_5$1,
    create_if_block_6$1,
    create_if_block_7$1,
    create_if_block_8$1
  ];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if ("center" === /*pull*/
    ctx2[1])
      return 0;
    if ("bottom" === /*pull*/
    ctx2[1])
      return 1;
    if ("top" === /*pull*/
    ctx2[1])
      return 2;
    if ("left" === /*pull*/
    ctx2[1])
      return 3;
    if ("right" === /*pull*/
    ctx2[1])
      return 4;
    if ("top-left" === /*pull*/
    ctx2[1])
      return 5;
    if ("top-right" === /*pull*/
    ctx2[1])
      return 6;
    if ("bottom-left" === /*pull*/
    ctx2[1])
      return 7;
    if ("bottom-right" === /*pull*/
    ctx2[1])
      return 8;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        } else {
          if_block = null;
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { expand = false } = $$props;
  let { pull = "center" } = $$props;
  $$self.$$set = ($$props2) => {
    if ("expand" in $$props2)
      $$invalidate(0, expand = $$props2.expand);
    if ("pull" in $$props2)
      $$invalidate(1, pull = $$props2.pull);
    if ("$$scope" in $$props2)
      $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [expand, pull, $$scope, slots];
}
class Center extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$9, safe_not_equal, { expand: 0, pull: 1 });
  }
}
function create_default_slot$3(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      attr(span, "class", "loading loading-spinner loading-lg");
    },
    m(target, anchor) {
      insert(target, span, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_fragment$8(ctx) {
  let center;
  let current;
  center = new Center({
    props: {
      pull: "top",
      $$slots: { default: [create_default_slot$3] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(center.$$.fragment);
    },
    m(target, anchor) {
      mount_component(center, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const center_changes = {};
      if (dirty & /*$$scope*/
      1) {
        center_changes.$$scope = { dirty, ctx: ctx2 };
      }
      center.$set(center_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(center.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(center.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(center, detaching);
    }
  };
}
class Loading extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment$8, safe_not_equal, {});
  }
}
const get_default_slot_changes$4 = (dirty) => ({});
const get_default_slot_context$4 = (ctx) => ({ using: { result: (
  /*result*/
  ctx[4]
) } });
function create_catch_block$3(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block$3(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    get_default_slot_context$4
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              get_default_slot_changes$4
            ),
            get_default_slot_context$4
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_pending_block$3(ctx) {
  let loading;
  let current;
  loading = new Loading({});
  return {
    c() {
      create_component(loading.$$.fragment);
    },
    m(target, anchor) {
      mount_component(loading, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(loading.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loading.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(loading, detaching);
    }
  };
}
function create_fragment$7(ctx) {
  let await_block_anchor;
  let current;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block$3,
    then: create_then_block$3,
    catch: create_catch_block$3,
    value: 4,
    blocks: [, , ,]
  };
  handle_promise(
    /*possible_promise*/
    ctx[0],
    info
  );
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target, anchor) {
      insert(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current = true;
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      update_await_block_branch(info, ctx, dirty);
    },
    i(local) {
      if (current)
        return;
      transition_in(info.block);
      current = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(await_block_anchor);
      }
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function instance$6($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { callback } = $$props;
  const possible_promise = callback();
  $$self.$$set = ($$props2) => {
    if ("callback" in $$props2)
      $$invalidate(1, callback = $$props2.callback);
    if ("$$scope" in $$props2)
      $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [possible_promise, callback, $$scope, slots];
}
class Invoke extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$7, safe_not_equal, { callback: 1 });
  }
}
const store_previous_pathname = writable(location.pathname);
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
const get_default_slot_changes$3 = (dirty) => ({ params: dirty & /*routeParams*/
4 });
const get_default_slot_context$3 = (ctx) => ({ params: (
  /*routeParams*/
  ctx[2]
) });
function create_if_block$4(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block_1$2, create_else_block$3];
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
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_else_block$3(ctx) {
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
    get_default_slot_context$3
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
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
              get_default_slot_changes$3
            ),
            get_default_slot_context$3
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block_1$2(ctx) {
  let await_block_anchor;
  let promise2;
  let current;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block$2,
    then: create_then_block$2,
    catch: create_catch_block$2,
    value: 12,
    blocks: [, , ,]
  };
  handle_promise(promise2 = /*component*/
  ctx[0], info);
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target, anchor) {
      insert(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current = true;
    },
    p(new_ctx, dirty) {
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
    i(local) {
      if (current)
        return;
      transition_in(info.block);
      current = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(await_block_anchor);
      }
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function create_catch_block$2(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block$2(ctx) {
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
    return { props: switch_instance_props };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component(switch_value, switch_props(ctx));
  }
  return {
    c() {
      if (switch_instance)
        create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m(target, anchor) {
      if (switch_instance)
        mount_component(switch_instance, target, anchor);
      insert(target, switch_instance_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
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
          switch_instance = construct_svelte_component(switch_value, switch_props(ctx2, dirty));
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
    i(local) {
      if (current)
        return;
      if (switch_instance)
        transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o(local) {
      if (switch_instance)
        transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(switch_instance_anchor);
      }
      if (switch_instance)
        destroy_component(switch_instance, detaching);
    }
  };
}
function create_pending_block$2(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_fragment$6(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*$activeRoute*/
    ctx[1] && /*$activeRoute*/
    ctx[1].route === /*route*/
    ctx[5] && create_if_block$4(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
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
          if_block = create_if_block$4(ctx2);
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance$5($$self, $$props, $$invalidate) {
  let $activeRoute;
  let { $$slots: slots = {}, $$scope } = $$props;
  let { path = "" } = $$props;
  let { component = null } = $$props;
  let routeParams = {};
  let routeProps = {};
  const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
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
class Route extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$6, safe_not_equal, { path: 6, component: 0 });
  }
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
  let location2 = getLocation(source);
  return {
    get location() {
      return location2;
    },
    listen(listener) {
      listeners.push(listener);
      const popstateListener = () => {
        location2 = getLocation(source);
        listener({ location: location2, action: "POP" });
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
      location2 = getLocation(source);
      listeners.forEach(
        (listener) => listener({ location: location2, action: "PUSH", preserveScroll })
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
const { navigate } = globalHistory;
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
const get_default_slot_changes$2 = (dirty) => ({
  route: dirty & /*$activeRoute*/
  4,
  location: dirty & /*$location*/
  2
});
const get_default_slot_context$2 = (ctx) => ({
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
function create_else_block$2(ctx) {
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
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
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
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block$3(ctx) {
  let previous_key = (
    /*$location*/
    ctx[1].pathname
  );
  let key_block_anchor;
  let current;
  let key_block = create_key_block(ctx);
  return {
    c() {
      key_block.c();
      key_block_anchor = empty();
    },
    m(target, anchor) {
      key_block.m(target, anchor);
      insert(target, key_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
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
    i(local) {
      if (current)
        return;
      transition_in(key_block);
      current = true;
    },
    o(local) {
      transition_out(key_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(key_block_anchor);
      }
      key_block.d(detaching);
    }
  };
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
    get_default_slot_context$2
  );
  return {
    c() {
      div = element("div");
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if (default_slot) {
        default_slot.m(div, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
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
              get_default_slot_changes$2
            ),
            get_default_slot_context$2
          );
        }
      }
    },
    i(local) {
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
    o(local) {
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
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if (default_slot)
        default_slot.d(detaching);
      if (detaching && div_outro)
        div_outro.end();
    }
  };
}
function create_fragment$5(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$3, create_else_block$2];
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
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let $location;
  let $routes;
  let $base;
  let $activeRoute;
  let { $$slots: slots = {}, $$scope } = $$props;
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
  component_subscribe($$self, routes, (value) => $$invalidate(12, $routes = value));
  const activeRoute = writable(null);
  component_subscribe($$self, activeRoute, (value) => $$invalidate(2, $activeRoute = value));
  let hasActiveRoute = false;
  const location2 = locationContext || writable(url ? { pathname: url } : history.location);
  component_subscribe($$self, location2, (value) => $$invalidate(1, $location = value));
  const base = routerContext ? routerContext.routerBase : writable({ path: basepath, uri: basepath });
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
        location2.set(event.location);
      });
      return unlisten;
    });
    setContext(LOCATION, location2);
  }
  setContext(ROUTER, {
    activeRoute,
    base,
    routerBase,
    registerRoute,
    unregisterRoute
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
    location2,
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
class Router extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$5, safe_not_equal, {
      basepath: 8,
      url: 9,
      viewtransition: 0,
      history: 10
    });
  }
}
function go(pathname) {
  store_previous_pathname.set(location.pathname);
  navigate(`${pathname}${location.hash}`);
}
const button_svelte_svelte_type_style_lang = "";
const get_default_slot_changes$1 = (dirty) => ({});
const get_default_slot_context$1 = (ctx) => ({
  using: {
    /**
    * When invoked, the button's slot will disappear, rendering instead the original contents of the button.
    *
    * > **Note**\
    * > This button can render custom contents (through its slot) **after** the button has been activated.\
    * > By calling this function these custom contents are ereased and the button will `reset` to its original state.
    */
    reset: (
      /*reset*/
      ctx[15]
    )
  }
});
function create_else_block$1(ctx) {
  let span;
  let current_block_type_index;
  let if_block;
  let current;
  const if_block_creators = [create_if_block_1$1, create_if_block_5, create_if_block_9, create_if_block_13];
  const if_blocks = [];
  function select_block_type_1(ctx2, dirty) {
    if (
      /*href*/
      ctx2[0]
    )
      return 0;
    if ("button" === /*type*/
    ctx2[10])
      return 1;
    if ("text" === /*type*/
    ctx2[10])
      return 2;
    if ("link" === /*type*/
    ctx2[10])
      return 3;
    return -1;
  }
  if (~(current_block_type_index = select_block_type_1(ctx))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  return {
    c() {
      span = element("span");
      if (if_block)
        if_block.c();
      attr(span, "class", "inline-grid rounded-3xl");
      toggle_class(span, "justify-start", !/*center*/
      ctx[8]);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(span, null);
      }
      current = true;
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_1(ctx2);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];
          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block.c();
          } else {
            if_block.p(ctx2, dirty);
          }
          transition_in(if_block, 1);
          if_block.m(span, null);
        } else {
          if_block = null;
        }
      }
      if (!current || dirty & /*center*/
      256) {
        toggle_class(span, "justify-start", !/*center*/
        ctx2[8]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
    }
  };
}
function create_if_block$2(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[17].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[16],
    get_default_slot_context$1
  );
  const default_slot_or_fallback = default_slot || fallback_block(ctx);
  return {
    c() {
      if (default_slot_or_fallback)
        default_slot_or_fallback.c();
    },
    m(target, anchor) {
      if (default_slot_or_fallback) {
        default_slot_or_fallback.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        65536)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[16],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[16]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[16],
              dirty,
              get_default_slot_changes$1
            ),
            get_default_slot_context$1
          );
        }
      } else {
        if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*slot_activated*/
        8192)) {
          default_slot_or_fallback.p(ctx2, !current ? -1 : dirty);
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot_or_fallback, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot_or_fallback, local);
      current = false;
    },
    d(detaching) {
      if (default_slot_or_fallback)
        default_slot_or_fallback.d(detaching);
    }
  };
}
function create_if_block_13(ctx) {
  let span;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_14, create_else_block_4];
  const if_blocks = [];
  function select_block_type_5(ctx2, dirty) {
    if (
      /*icon_path*/
      ctx2[9] && /*icon_position*/
      ctx2[7] === "left"
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_5(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      span = element("span");
      if_block.c();
      attr(span, "class", "btn-custom hover:underline justify-center self-center text-base-content svelte-1tatzwi");
      toggle_class(
        span,
        "with-icon-left",
        /*icon_path*/
        ctx[9] && /*icon_position*/
        ctx[7] === "left"
      );
      toggle_class(
        span,
        "with-icon-right",
        /*icon_path*/
        ctx[9] && /*icon_position*/
        ctx[7] === "right"
      );
      toggle_class(
        span,
        "disabled",
        /*disabled*/
        ctx[11]
      );
      toggle_class(
        span,
        "active",
        /*active*/
        ctx[3]
      );
      toggle_class(
        span,
        "with-icon",
        /*icon_path*/
        ctx[9]
      );
      toggle_class(
        span,
        "text-xs",
        /*small*/
        ctx[2]
      );
      toggle_class(span, "text-base-content", "base" === /*variant*/
      ctx[12]);
      toggle_class(span, "text-info-content", "information" === /*variant*/
      ctx[12]);
      toggle_class(span, "text-warning-content", "warning" === /*variant*/
      ctx[12]);
      toggle_class(span, "text-error-content", "error" === /*variant*/
      ctx[12]);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if_blocks[current_block_type_index].m(span, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          span,
          "mouseup",
          /*mouseup_handler_3*/
          ctx[22]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_5(ctx2);
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
        if_block.m(span, null);
      }
      if (!current || dirty & /*icon_path, icon_position*/
      640) {
        toggle_class(
          span,
          "with-icon-left",
          /*icon_path*/
          ctx2[9] && /*icon_position*/
          ctx2[7] === "left"
        );
      }
      if (!current || dirty & /*icon_path, icon_position*/
      640) {
        toggle_class(
          span,
          "with-icon-right",
          /*icon_path*/
          ctx2[9] && /*icon_position*/
          ctx2[7] === "right"
        );
      }
      if (!current || dirty & /*disabled*/
      2048) {
        toggle_class(
          span,
          "disabled",
          /*disabled*/
          ctx2[11]
        );
      }
      if (!current || dirty & /*active*/
      8) {
        toggle_class(
          span,
          "active",
          /*active*/
          ctx2[3]
        );
      }
      if (!current || dirty & /*icon_path*/
      512) {
        toggle_class(
          span,
          "with-icon",
          /*icon_path*/
          ctx2[9]
        );
      }
      if (!current || dirty & /*small*/
      4) {
        toggle_class(
          span,
          "text-xs",
          /*small*/
          ctx2[2]
        );
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(span, "text-base-content", "base" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(span, "text-info-content", "information" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(span, "text-warning-content", "warning" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(span, "text-error-content", "error" === /*variant*/
        ctx2[12]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if_blocks[current_block_type_index].d();
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_9(ctx) {
  let span;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_10, create_else_block_3];
  const if_blocks = [];
  function select_block_type_4(ctx2, dirty) {
    if (
      /*icon_path*/
      ctx2[9] && /*icon_position*/
      ctx2[7] === "left"
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_4(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      span = element("span");
      if_block.c();
      attr(span, "class", "btn-custom svelte-1tatzwi");
      toggle_class(
        span,
        "active",
        /*active*/
        ctx[3]
      );
      toggle_class(
        span,
        "with-icon-left",
        /*icon_path*/
        ctx[9] && /*icon_position*/
        ctx[7] === "left"
      );
      toggle_class(
        span,
        "with-icon-right",
        /*icon_path*/
        ctx[9] && /*icon_position*/
        ctx[7] === "right"
      );
      toggle_class(
        span,
        "disabled",
        /*disabled*/
        ctx[11]
      );
      toggle_class(
        span,
        "text-xs",
        /*small*/
        ctx[2]
      );
      toggle_class(span, "text-base-content", "base" === /*variant*/
      ctx[12]);
      toggle_class(span, "text-info-content", "information" === /*variant*/
      ctx[12]);
      toggle_class(span, "text-warning-content", "warning" === /*variant*/
      ctx[12]);
      toggle_class(span, "text-error-content", "error" === /*variant*/
      ctx[12]);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      if_blocks[current_block_type_index].m(span, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          span,
          "mouseup",
          /*mouseup_handler_2*/
          ctx[21]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_4(ctx2);
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
        if_block.m(span, null);
      }
      if (!current || dirty & /*active*/
      8) {
        toggle_class(
          span,
          "active",
          /*active*/
          ctx2[3]
        );
      }
      if (!current || dirty & /*icon_path, icon_position*/
      640) {
        toggle_class(
          span,
          "with-icon-left",
          /*icon_path*/
          ctx2[9] && /*icon_position*/
          ctx2[7] === "left"
        );
      }
      if (!current || dirty & /*icon_path, icon_position*/
      640) {
        toggle_class(
          span,
          "with-icon-right",
          /*icon_path*/
          ctx2[9] && /*icon_position*/
          ctx2[7] === "right"
        );
      }
      if (!current || dirty & /*disabled*/
      2048) {
        toggle_class(
          span,
          "disabled",
          /*disabled*/
          ctx2[11]
        );
      }
      if (!current || dirty & /*small*/
      4) {
        toggle_class(
          span,
          "text-xs",
          /*small*/
          ctx2[2]
        );
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(span, "text-base-content", "base" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(span, "text-info-content", "information" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(span, "text-warning-content", "warning" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(span, "text-error-content", "error" === /*variant*/
        ctx2[12]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
      if_blocks[current_block_type_index].d();
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_5(ctx) {
  let button;
  let current_block_type_index;
  let if_block;
  let button_style_value;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_6, create_else_block_2];
  const if_blocks = [];
  function select_block_type_3(ctx2, dirty) {
    if (
      /*icon_path*/
      ctx2[9] && /*icon_position*/
      ctx2[7] === "left"
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_3(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      button = element("button");
      if_block.c();
      button.disabled = /*disabled*/
      ctx[11];
      attr(button, "class", "btn-custom btn btn-primary w-32 justify-center self-center with-icon at-least-this-wide svelte-1tatzwi");
      attr(button, "style", button_style_value = /*transparent*/
      ctx[6] && !/*outline*/
      ctx[5] ? "border-width:0;" : "");
      toggle_class(
        button,
        "active",
        /*active*/
        ctx[3]
      );
      toggle_class(
        button,
        "with-icon-left",
        /*icon_path*/
        ctx[9] && /*icon_position*/
        ctx[7] === "left"
      );
      toggle_class(
        button,
        "with-icon-right",
        /*icon_path*/
        ctx[9] && /*icon_position*/
        ctx[7] === "right"
      );
      toggle_class(
        button,
        "btn-outline",
        /*outline*/
        ctx[5] || /*transparent*/
        ctx[6]
      );
      toggle_class(
        button,
        "text-xs",
        /*small*/
        ctx[2]
      );
      toggle_class(button, "btn-base", "base" === /*variant*/
      ctx[12]);
      toggle_class(button, "btn-info", "information" === /*variant*/
      ctx[12]);
      toggle_class(button, "btn-warning", "warning" === /*variant*/
      ctx[12]);
      toggle_class(button, "btn-error", "error" === /*variant*/
      ctx[12]);
    },
    m(target, anchor) {
      insert(target, button, anchor);
      if_blocks[current_block_type_index].m(button, null);
      current = true;
      if (!mounted) {
        dispose = listen(
          button,
          "mouseup",
          /*mouseup_handler_1*/
          ctx[20]
        );
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_3(ctx2);
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
        if_block.m(button, null);
      }
      if (!current || dirty & /*disabled*/
      2048) {
        button.disabled = /*disabled*/
        ctx2[11];
      }
      if (!current || dirty & /*transparent, outline*/
      96 && button_style_value !== (button_style_value = /*transparent*/
      ctx2[6] && !/*outline*/
      ctx2[5] ? "border-width:0;" : "")) {
        attr(button, "style", button_style_value);
      }
      if (!current || dirty & /*active*/
      8) {
        toggle_class(
          button,
          "active",
          /*active*/
          ctx2[3]
        );
      }
      if (!current || dirty & /*icon_path, icon_position*/
      640) {
        toggle_class(
          button,
          "with-icon-left",
          /*icon_path*/
          ctx2[9] && /*icon_position*/
          ctx2[7] === "left"
        );
      }
      if (!current || dirty & /*icon_path, icon_position*/
      640) {
        toggle_class(
          button,
          "with-icon-right",
          /*icon_path*/
          ctx2[9] && /*icon_position*/
          ctx2[7] === "right"
        );
      }
      if (!current || dirty & /*outline, transparent*/
      96) {
        toggle_class(
          button,
          "btn-outline",
          /*outline*/
          ctx2[5] || /*transparent*/
          ctx2[6]
        );
      }
      if (!current || dirty & /*small*/
      4) {
        toggle_class(
          button,
          "text-xs",
          /*small*/
          ctx2[2]
        );
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(button, "btn-base", "base" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(button, "btn-info", "information" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(button, "btn-warning", "warning" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(button, "btn-error", "error" === /*variant*/
        ctx2[12]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(button);
      }
      if_blocks[current_block_type_index].d();
      mounted = false;
      dispose();
    }
  };
}
function create_if_block_1$1(ctx) {
  let a;
  let current_block_type_index;
  let if_block;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_2, create_else_block_1];
  const if_blocks = [];
  function select_block_type_2(ctx2, dirty) {
    if (
      /*icon_path*/
      ctx2[9] && /*icon_position*/
      ctx2[7] === "left"
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type_2(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      a = element("a");
      if_block.c();
      attr(
        a,
        "href",
        /*href*/
        ctx[0]
      );
      attr(a, "class", "btn-custom hover:underline justify-center self-center text-base-content svelte-1tatzwi");
      attr(a, "target", "_blank");
      toggle_class(
        a,
        "text-xs",
        /*small*/
        ctx[2]
      );
      toggle_class(
        a,
        "with-icon-left",
        /*icon_path*/
        ctx[9] && /*icon_position*/
        ctx[7] === "left"
      );
      toggle_class(
        a,
        "with-icon-right",
        /*icon_path*/
        ctx[9] && /*icon_position*/
        ctx[7] === "right"
      );
      toggle_class(
        a,
        "disabled",
        /*disabled*/
        ctx[11]
      );
      toggle_class(
        a,
        "active",
        /*active*/
        ctx[3]
      );
      toggle_class(a, "text-base-content", "base" === /*variant*/
      ctx[12]);
      toggle_class(a, "text-info-content", "information" === /*variant*/
      ctx[12]);
      toggle_class(a, "text-warning-content", "warning" === /*variant*/
      ctx[12]);
      toggle_class(a, "text-error-content", "error" === /*variant*/
      ctx[12]);
      toggle_class(a, "badge-success", "success" === /*variant*/
      ctx[12]);
    },
    m(target, anchor) {
      insert(target, a, anchor);
      if_blocks[current_block_type_index].m(a, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(a, "click", click_handler),
          listen(
            a,
            "mouseup",
            /*mouseup_handler*/
            ctx[19]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type_2(ctx2);
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
        if_block.m(a, null);
      }
      if (!current || dirty & /*href*/
      1) {
        attr(
          a,
          "href",
          /*href*/
          ctx2[0]
        );
      }
      if (!current || dirty & /*small*/
      4) {
        toggle_class(
          a,
          "text-xs",
          /*small*/
          ctx2[2]
        );
      }
      if (!current || dirty & /*icon_path, icon_position*/
      640) {
        toggle_class(
          a,
          "with-icon-left",
          /*icon_path*/
          ctx2[9] && /*icon_position*/
          ctx2[7] === "left"
        );
      }
      if (!current || dirty & /*icon_path, icon_position*/
      640) {
        toggle_class(
          a,
          "with-icon-right",
          /*icon_path*/
          ctx2[9] && /*icon_position*/
          ctx2[7] === "right"
        );
      }
      if (!current || dirty & /*disabled*/
      2048) {
        toggle_class(
          a,
          "disabled",
          /*disabled*/
          ctx2[11]
        );
      }
      if (!current || dirty & /*active*/
      8) {
        toggle_class(
          a,
          "active",
          /*active*/
          ctx2[3]
        );
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(a, "text-base-content", "base" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(a, "text-info-content", "information" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(a, "text-warning-content", "warning" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(a, "text-error-content", "error" === /*variant*/
        ctx2[12]);
      }
      if (!current || dirty & /*variant*/
      4096) {
        toggle_class(a, "badge-success", "success" === /*variant*/
        ctx2[12]);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(a);
      }
      if_blocks[current_block_type_index].d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_else_block_4(ctx) {
  let span;
  let t0;
  let t1;
  let if_block_anchor;
  let current;
  let if_block = (
    /*icon_path*/
    ctx[9] && create_if_block_16(ctx)
  );
  return {
    c() {
      span = element("span");
      t0 = text(
        /*label*/
        ctx[1]
      );
      t1 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      insert(target, t1, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*label*/
      2)
        set_data(
          t0,
          /*label*/
          ctx2[1]
        );
      if (
        /*icon_path*/
        ctx2[9]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*icon_path*/
          512) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_16(ctx2);
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_14(ctx) {
  let t0;
  let span;
  let t1;
  let current;
  let if_block = (
    /*icon_path*/
    ctx[9] && create_if_block_15(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      t0 = space();
      span = element("span");
      t1 = text(
        /*label*/
        ctx[1]
      );
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, span, anchor);
      append(span, t1);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*icon_path*/
        ctx2[9]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*icon_path*/
          512) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_15(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(t0.parentNode, t0);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (!current || dirty & /*label*/
      2)
        set_data(
          t1,
          /*label*/
          ctx2[1]
        );
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(span);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_16(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: (
    /*icon_path*/
    ctx[9]
  ) } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      512)
        icon_changes.path = /*icon_path*/
        ctx2[9];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_if_block_15(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: (
    /*icon_path*/
    ctx[9]
  ) } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      512)
        icon_changes.path = /*icon_path*/
        ctx2[9];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_else_block_3(ctx) {
  let span;
  let t0;
  let t1;
  let if_block_anchor;
  let current;
  let if_block = (
    /*icon_path*/
    ctx[9] && create_if_block_12(ctx)
  );
  return {
    c() {
      span = element("span");
      t0 = text(
        /*label*/
        ctx[1]
      );
      t1 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      attr(span, "class", "justify-center self-center");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      insert(target, t1, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*label*/
      2)
        set_data(
          t0,
          /*label*/
          ctx2[1]
        );
      if (
        /*icon_path*/
        ctx2[9]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*icon_path*/
          512) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_12(ctx2);
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_10(ctx) {
  let t0;
  let span;
  let t1;
  let current;
  let if_block = (
    /*icon_path*/
    ctx[9] && create_if_block_11(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      t0 = space();
      span = element("span");
      t1 = text(
        /*label*/
        ctx[1]
      );
      attr(span, "class", "justify-center self-center");
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, span, anchor);
      append(span, t1);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*icon_path*/
        ctx2[9]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*icon_path*/
          512) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_11(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(t0.parentNode, t0);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (!current || dirty & /*label*/
      2)
        set_data(
          t1,
          /*label*/
          ctx2[1]
        );
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(span);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_12(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: (
    /*icon_path*/
    ctx[9]
  ) } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      512)
        icon_changes.path = /*icon_path*/
        ctx2[9];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_if_block_11(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: (
    /*icon_path*/
    ctx[9]
  ) } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      512)
        icon_changes.path = /*icon_path*/
        ctx2[9];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_else_block_2(ctx) {
  let span;
  let t0;
  let t1;
  let if_block_anchor;
  let current;
  let if_block = (
    /*icon_path*/
    ctx[9] && create_if_block_8(ctx)
  );
  return {
    c() {
      span = element("span");
      t0 = text(
        /*label*/
        ctx[1]
      );
      t1 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
      attr(span, "class", "justify-center self-center");
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      insert(target, t1, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*label*/
      2)
        set_data(
          t0,
          /*label*/
          ctx2[1]
        );
      if (
        /*icon_path*/
        ctx2[9]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*icon_path*/
          512) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_8(ctx2);
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_6(ctx) {
  let t0;
  let span;
  let t1;
  let current;
  let if_block = (
    /*icon_path*/
    ctx[9] && create_if_block_7(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      t0 = space();
      span = element("span");
      t1 = text(
        /*label*/
        ctx[1]
      );
      attr(span, "class", "justify-center self-center");
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, span, anchor);
      append(span, t1);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*icon_path*/
        ctx2[9]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*icon_path*/
          512) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_7(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(t0.parentNode, t0);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (!current || dirty & /*label*/
      2)
        set_data(
          t1,
          /*label*/
          ctx2[1]
        );
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(span);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_8(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: (
    /*icon_path*/
    ctx[9]
  ) } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      512)
        icon_changes.path = /*icon_path*/
        ctx2[9];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_if_block_7(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: (
    /*icon_path*/
    ctx[9]
  ) } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      512)
        icon_changes.path = /*icon_path*/
        ctx2[9];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_else_block_1(ctx) {
  let span;
  let t0;
  let t1;
  let if_block_anchor;
  let current;
  let if_block = (
    /*icon_path*/
    ctx[9] && create_if_block_4(ctx)
  );
  return {
    c() {
      span = element("span");
      t0 = text(
        /*label*/
        ctx[1]
      );
      t1 = space();
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t0);
      insert(target, t1, anchor);
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (!current || dirty & /*label*/
      2)
        set_data(
          t0,
          /*label*/
          ctx2[1]
        );
      if (
        /*icon_path*/
        ctx2[9]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*icon_path*/
          512) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_4(ctx2);
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(span);
        detach(t1);
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let t0;
  let span;
  let t1;
  let current;
  let if_block = (
    /*icon_path*/
    ctx[9] && create_if_block_3(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      t0 = space();
      span = element("span");
      t1 = text(
        /*label*/
        ctx[1]
      );
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, t0, anchor);
      insert(target, span, anchor);
      append(span, t1);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*icon_path*/
        ctx2[9]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*icon_path*/
          512) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block_3(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(t0.parentNode, t0);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
      if (!current || dirty & /*label*/
      2)
        set_data(
          t1,
          /*label*/
          ctx2[1]
        );
    },
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(t0);
        detach(span);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function create_if_block_4(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: (
    /*icon_path*/
    ctx[9]
  ) } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      512)
        icon_changes.path = /*icon_path*/
        ctx2[9];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_if_block_3(ctx) {
  let icon;
  let current;
  icon = new Icon({ props: { path: (
    /*icon_path*/
    ctx[9]
  ) } });
  return {
    c() {
      create_component(icon.$$.fragment);
    },
    m(target, anchor) {
      mount_component(icon, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const icon_changes = {};
      if (dirty & /*icon_path*/
      512)
        icon_changes.path = /*icon_path*/
        ctx2[9];
      icon.$set(icon_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(icon.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(icon.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(icon, detaching);
    }
  };
}
function create_catch_block$1(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block$1(ctx) {
  let invoke;
  let current;
  invoke = new Invoke({ props: { callback: (
    /*func*/
    ctx[18]
  ) } });
  return {
    c() {
      create_component(invoke.$$.fragment);
    },
    m(target, anchor) {
      mount_component(invoke, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const invoke_changes = {};
      if (dirty & /*slot_activated*/
      8192)
        invoke_changes.callback = /*func*/
        ctx2[18];
      invoke.$set(invoke_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(invoke.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(invoke.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(invoke, detaching);
    }
  };
}
function create_pending_block$1(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function fallback_block(ctx) {
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
    value: 24,
    blocks: [, , ,]
  };
  handle_promise(tick(), info);
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target, anchor) {
      insert(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      update_await_block_branch(info, ctx, dirty);
    },
    i(local) {
      if (current)
        return;
      transition_in(info.block);
      current = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(await_block_anchor);
      }
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function create_fragment$4(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$2, create_else_block$1];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*slot_activated*/
      ctx2[13]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
const click_handler = function run2(e) {
  e.preventDefault();
};
function instance$3($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { href = "" } = $$props;
  let { label = "" } = $$props;
  let { small = false } = $$props;
  let { active: active2 = false } = $$props;
  let { stop_propagation = false } = $$props;
  let { outline = false } = $$props;
  let { transparent = true } = $$props;
  let { icon_position = "right" } = $$props;
  let { center = true } = $$props;
  let { icon_path = "" } = $$props;
  let { type = "button" } = $$props;
  let { disabled = false } = $$props;
  let { variant = "base" } = $$props;
  let slot_activated = false;
  const emit = createEventDispatcher();
  function activate() {
    if (disabled) {
      return;
    }
    $$invalidate(13, slot_activated = true);
    emit("activate");
  }
  function reset() {
    $$invalidate(13, slot_activated = false);
  }
  const func = function run7() {
    $$invalidate(13, slot_activated = false);
  };
  const mouseup_handler = function run7(e) {
    if (stop_propagation) {
      e.stopPropagation();
    }
    if (disabled) {
      return;
    }
    e.preventDefault();
    if (href.startsWith("http")) {
      window.open(href);
    } else {
      go(href);
    }
  };
  const mouseup_handler_1 = function run7(e) {
    if (stop_propagation) {
      e.stopPropagation();
    }
    activate();
  };
  const mouseup_handler_2 = function eun(e) {
    if (stop_propagation) {
      e.stopPropagation();
    }
    activate();
  };
  const mouseup_handler_3 = function run7(e) {
    if (stop_propagation) {
      e.stopPropagation();
    }
    activate();
  };
  $$self.$$set = ($$props2) => {
    if ("href" in $$props2)
      $$invalidate(0, href = $$props2.href);
    if ("label" in $$props2)
      $$invalidate(1, label = $$props2.label);
    if ("small" in $$props2)
      $$invalidate(2, small = $$props2.small);
    if ("active" in $$props2)
      $$invalidate(3, active2 = $$props2.active);
    if ("stop_propagation" in $$props2)
      $$invalidate(4, stop_propagation = $$props2.stop_propagation);
    if ("outline" in $$props2)
      $$invalidate(5, outline = $$props2.outline);
    if ("transparent" in $$props2)
      $$invalidate(6, transparent = $$props2.transparent);
    if ("icon_position" in $$props2)
      $$invalidate(7, icon_position = $$props2.icon_position);
    if ("center" in $$props2)
      $$invalidate(8, center = $$props2.center);
    if ("icon_path" in $$props2)
      $$invalidate(9, icon_path = $$props2.icon_path);
    if ("type" in $$props2)
      $$invalidate(10, type = $$props2.type);
    if ("disabled" in $$props2)
      $$invalidate(11, disabled = $$props2.disabled);
    if ("variant" in $$props2)
      $$invalidate(12, variant = $$props2.variant);
    if ("$$scope" in $$props2)
      $$invalidate(16, $$scope = $$props2.$$scope);
  };
  return [
    href,
    label,
    small,
    active2,
    stop_propagation,
    outline,
    transparent,
    icon_position,
    center,
    icon_path,
    type,
    disabled,
    variant,
    slot_activated,
    activate,
    reset,
    $$scope,
    slots,
    func,
    mouseup_handler,
    mouseup_handler_1,
    mouseup_handler_2,
    mouseup_handler_3
  ];
}
class Button extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$4, safe_not_equal, {
      href: 0,
      label: 1,
      small: 2,
      active: 3,
      stop_propagation: 4,
      outline: 5,
      transparent: 6,
      icon_position: 7,
      center: 8,
      icon_path: 9,
      type: 10,
      disabled: 11,
      variant: 12
    });
  }
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[5] = list[i];
  return child_ctx;
}
function create_if_block$1(ctx) {
  let div3;
  let div0;
  let center;
  let t0;
  let div1;
  let t1;
  let span;
  let t2_value = (
    /*$message*/
    ctx[1].text + ""
  );
  let t2;
  let t3;
  let t4;
  let div2;
  let div3_intro;
  let div3_outro;
  let current;
  center = new Center({
    props: {
      $$slots: { default: [create_default_slot$2] },
      $$scope: { ctx }
    }
  });
  let if_block = (
    /*$message*/
    ctx[1].buttons.length > 0 && create_if_block_1()
  );
  let each_value = ensure_array_like(
    /*$message*/
    ctx[1].buttons
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div3 = element("div");
      div0 = element("div");
      create_component(center.$$.fragment);
      t0 = space();
      div1 = element("div");
      t1 = space();
      span = element("span");
      t2 = text(t2_value);
      t3 = space();
      if (if_block)
        if_block.c();
      t4 = space();
      div2 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div0, "class", "absolute -top-3 left-0 right-0 font-bold");
      attr(div1, "class", "pt-2");
      attr(div2, "class", "flex flex-wrap gap-2 justify-center relative w-full");
      attr(div3, "class", "fixed bg-base-100 rounded-3xl p-4 z-30 right-4 bottom-4 border-opacity-30");
      set_style(div3, "border-width", "1px");
      toggle_class(div3, "w-80", !/*smaller*/
      ctx[0]);
      toggle_class(
        div3,
        "left-4",
        /*smaller*/
        ctx[0]
      );
      toggle_class(div3, "border-base-content", "base" === /*$message*/
      ctx[1].variant);
      toggle_class(div3, "border-error", "error" === /*$message*/
      ctx[1].variant);
      toggle_class(div3, "border-warning", "warning" === /*$message*/
      ctx[1].variant);
      toggle_class(div3, "border-info", "information" === /*$message*/
      ctx[1].variant);
      toggle_class(div3, "text-base-content", "base" === /*$message*/
      ctx[1].variant);
      toggle_class(div3, "text-error", "error" === /*$message*/
      ctx[1].variant);
      toggle_class(div3, "text-warning", "warning" === /*$message*/
      ctx[1].variant);
      toggle_class(div3, "text-info", "information" === /*$message*/
      ctx[1].variant);
    },
    m(target, anchor) {
      insert(target, div3, anchor);
      append(div3, div0);
      mount_component(center, div0, null);
      append(div3, t0);
      append(div3, div1);
      append(div3, t1);
      append(div3, span);
      append(span, t2);
      append(div3, t3);
      if (if_block)
        if_block.m(div3, null);
      append(div3, t4);
      append(div3, div2);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div2, null);
        }
      }
      current = true;
    },
    p(ctx2, dirty) {
      const center_changes = {};
      if (dirty & /*$$scope, $message*/
      258) {
        center_changes.$$scope = { dirty, ctx: ctx2 };
      }
      center.$set(center_changes);
      if ((!current || dirty & /*$message*/
      2) && t2_value !== (t2_value = /*$message*/
      ctx2[1].text + ""))
        set_data(t2, t2_value);
      if (
        /*$message*/
        ctx2[1].buttons.length > 0
      ) {
        if (if_block)
          ;
        else {
          if_block = create_if_block_1();
          if_block.c();
          if_block.m(div3, t4);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & /*$message, close*/
      6) {
        each_value = ensure_array_like(
          /*$message*/
          ctx2[1].buttons
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(div2, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (!current || dirty & /*smaller*/
      1) {
        toggle_class(div3, "w-80", !/*smaller*/
        ctx2[0]);
      }
      if (!current || dirty & /*smaller*/
      1) {
        toggle_class(
          div3,
          "left-4",
          /*smaller*/
          ctx2[0]
        );
      }
      if (!current || dirty & /*$message*/
      2) {
        toggle_class(div3, "border-base-content", "base" === /*$message*/
        ctx2[1].variant);
      }
      if (!current || dirty & /*$message*/
      2) {
        toggle_class(div3, "border-error", "error" === /*$message*/
        ctx2[1].variant);
      }
      if (!current || dirty & /*$message*/
      2) {
        toggle_class(div3, "border-warning", "warning" === /*$message*/
        ctx2[1].variant);
      }
      if (!current || dirty & /*$message*/
      2) {
        toggle_class(div3, "border-info", "information" === /*$message*/
        ctx2[1].variant);
      }
      if (!current || dirty & /*$message*/
      2) {
        toggle_class(div3, "text-base-content", "base" === /*$message*/
        ctx2[1].variant);
      }
      if (!current || dirty & /*$message*/
      2) {
        toggle_class(div3, "text-error", "error" === /*$message*/
        ctx2[1].variant);
      }
      if (!current || dirty & /*$message*/
      2) {
        toggle_class(div3, "text-warning", "warning" === /*$message*/
        ctx2[1].variant);
      }
      if (!current || dirty & /*$message*/
      2) {
        toggle_class(div3, "text-info", "information" === /*$message*/
        ctx2[1].variant);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(center.$$.fragment, local);
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      if (local) {
        add_render_callback(() => {
          if (!current)
            return;
          if (div3_outro)
            div3_outro.end(1);
          div3_intro = create_in_transition(div3, fly, { y: 300, duration: 300 });
          div3_intro.start();
        });
      }
      current = true;
    },
    o(local) {
      transition_out(center.$$.fragment, local);
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      if (div3_intro)
        div3_intro.invalidate();
      if (local) {
        div3_outro = create_out_transition(div3, fly, { y: 100, duration: 300 });
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div3);
      }
      destroy_component(center);
      if (if_block)
        if_block.d();
      destroy_each(each_blocks, detaching);
      if (detaching && div3_outro)
        div3_outro.end();
    }
  };
}
function create_default_slot$2(ctx) {
  let badge;
  let current;
  badge = new Badge({
    props: {
      variant: (
        /*$message*/
        ctx[1].variant
      ),
      text: (
        /*$message*/
        ctx[1].variant.toUpperCase()
      )
    }
  });
  return {
    c() {
      create_component(badge.$$.fragment);
    },
    m(target, anchor) {
      mount_component(badge, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const badge_changes = {};
      if (dirty & /*$message*/
      2)
        badge_changes.variant = /*$message*/
        ctx2[1].variant;
      if (dirty & /*$message*/
      2)
        badge_changes.text = /*$message*/
        ctx2[1].variant.toUpperCase();
      badge.$set(badge_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(badge.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(badge.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(badge, detaching);
    }
  };
}
function create_if_block_1(ctx) {
  let div;
  return {
    c() {
      div = element("div");
      attr(div, "class", "pt-8");
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    d(detaching) {
      if (detaching) {
        detach(div);
      }
    }
  };
}
function create_each_block$1(ctx) {
  let button_1;
  let current;
  function activate_handler() {
    return (
      /*activate_handler*/
      ctx[4](
        /*button*/
        ctx[5]
      )
    );
  }
  button_1 = new Button({
    props: {
      variant: (
        /*$message*/
        ctx[1].variant
      ),
      label: (
        /*button*/
        ctx[5].label
      ),
      icon_path: (
        /*button*/
        ctx[5].icon_path
      ),
      icon_position: (
        /*button*/
        ctx[5].icon_position
      ),
      type: "button",
      transparent: true
    }
  });
  button_1.$on("activate", activate_handler);
  return {
    c() {
      create_component(button_1.$$.fragment);
    },
    m(target, anchor) {
      mount_component(button_1, target, anchor);
      current = true;
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const button_1_changes = {};
      if (dirty & /*$message*/
      2)
        button_1_changes.variant = /*$message*/
        ctx[1].variant;
      if (dirty & /*$message*/
      2)
        button_1_changes.label = /*button*/
        ctx[5].label;
      if (dirty & /*$message*/
      2)
        button_1_changes.icon_path = /*button*/
        ctx[5].icon_path;
      if (dirty & /*$message*/
      2)
        button_1_changes.icon_position = /*button*/
        ctx[5].icon_position;
      button_1.$set(button_1_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(button_1.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(button_1.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(button_1, detaching);
    }
  };
}
function create_fragment$3(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*$message*/
    ctx[1] && create_if_block$1(ctx)
  );
  return {
    c() {
      if (if_block)
        if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block)
        if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*$message*/
        ctx2[1]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*$message*/
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if (if_block)
        if_block.d(detaching);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let smaller;
  let $message;
  let $store_layout;
  component_subscribe($$self, message, ($$value) => $$invalidate(1, $message = $$value));
  component_subscribe($$self, store_layout, ($$value) => $$invalidate(3, $store_layout = $$value));
  function close2() {
    set_store_value(message, $message = false, $message);
  }
  const activate_handler = function run7(button) {
    button.action({ close: close2 });
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$store_layout*/
    8) {
      $$invalidate(0, smaller = "smaller" === $store_layout);
    }
  };
  return [smaller, $message, close2, $store_layout, activate_handler];
}
class Message extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$3, safe_not_equal, {});
  }
}
function error(value) {
  if (value instanceof Error) {
    return [false, value];
  }
  return [false, new Error(`${value}`)];
}
function ok(value) {
  return [value, false];
}
function storable({
  name,
  default_value,
  serialize = function convert(x) {
    return JSON.stringify(x);
  },
  deserialize = function convert(x) {
    return JSON.parse(x);
  }
}) {
  const key = `storable_${name}`;
  if (localStorage[key]) {
    try {
      default_value = deserialize(localStorage[key]);
    } catch (e) {
      console.warn(e);
    }
  }
  const result = writable(default_value);
  result.subscribe(function watch2($result) {
    localStorage.setItem(key, serialize($result));
  });
  return result;
}
const store_token = storable({
  name: "store_token",
  default_value: false
});
const store_cache_touches = storable({
  name: "touches",
  default_value: {}
});
new Promise(function run3() {
  return true;
});
new Promise(function run4(resolve) {
  resolve();
});
new Promise(function run5(resolve) {
  resolve([]);
});
new Promise(function run6(resolve) {
  resolve(ok(true));
});
const IS_DEV = "80" !== location.port && "443" !== location.port;
const CACHE_LIFETIME = IS_DEV ? 1e10 : 1e3 * 10;
function delay({ milliseconds }) {
  return new Promise(function run7(resolve) {
    return setTimeout(resolve, milliseconds);
  });
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var dexie_min = { exports: {} };
(function(module, exports) {
  (function(e, t) {
    module.exports = t();
  })(commonjsGlobal, function() {
    var s = function(e2, t2) {
      return (s = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(e3, t3) {
        e3.__proto__ = t3;
      } || function(e3, t3) {
        for (var n2 in t3)
          Object.prototype.hasOwnProperty.call(t3, n2) && (e3[n2] = t3[n2]);
      })(e2, t2);
    };
    var _ = function() {
      return (_ = Object.assign || function(e2) {
        for (var t2, n2 = 1, r2 = arguments.length; n2 < r2; n2++)
          for (var i2 in t2 = arguments[n2])
            Object.prototype.hasOwnProperty.call(t2, i2) && (e2[i2] = t2[i2]);
        return e2;
      }).apply(this, arguments);
    };
    function i(e2, t2, n2) {
      if (n2 || 2 === arguments.length)
        for (var r2, i2 = 0, o2 = t2.length; i2 < o2; i2++)
          !r2 && i2 in t2 || ((r2 = r2 || Array.prototype.slice.call(t2, 0, i2))[i2] = t2[i2]);
      return e2.concat(r2 || Array.prototype.slice.call(t2));
    }
    var f = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : commonjsGlobal, k = Object.keys, g = Array.isArray;
    function a(t2, n2) {
      return "object" != typeof n2 || k(n2).forEach(function(e2) {
        t2[e2] = n2[e2];
      }), t2;
    }
    "undefined" == typeof Promise || f.Promise || (f.Promise = Promise);
    var c = Object.getPrototypeOf, n = {}.hasOwnProperty;
    function m(e2, t2) {
      return n.call(e2, t2);
    }
    function r(t2, n2) {
      "function" == typeof n2 && (n2 = n2(c(t2))), ("undefined" == typeof Reflect ? k : Reflect.ownKeys)(n2).forEach(function(e2) {
        l(t2, e2, n2[e2]);
      });
    }
    var u = Object.defineProperty;
    function l(e2, t2, n2, r2) {
      u(e2, t2, a(n2 && m(n2, "get") && "function" == typeof n2.get ? { get: n2.get, set: n2.set, configurable: true } : { value: n2, configurable: true, writable: true }, r2));
    }
    function o(t2) {
      return { from: function(e2) {
        return t2.prototype = Object.create(e2.prototype), l(t2.prototype, "constructor", t2), { extend: r.bind(null, t2.prototype) };
      } };
    }
    var h = Object.getOwnPropertyDescriptor;
    function d(e2, t2) {
      return h(e2, t2) || (e2 = c(e2)) && d(e2, t2);
    }
    var p = [].slice;
    function y(e2, t2, n2) {
      return p.call(e2, t2, n2);
    }
    function v(e2, t2) {
      return t2(e2);
    }
    function b(e2) {
      if (!e2)
        throw new Error("Assertion Failed");
    }
    function w(e2) {
      f.setImmediate ? setImmediate(e2) : setTimeout(e2, 0);
    }
    function x(e2, t2) {
      if ("string" == typeof t2 && m(e2, t2))
        return e2[t2];
      if (!t2)
        return e2;
      if ("string" != typeof t2) {
        for (var n2 = [], r2 = 0, i2 = t2.length; r2 < i2; ++r2) {
          var o2 = x(e2, t2[r2]);
          n2.push(o2);
        }
        return n2;
      }
      var a2 = t2.indexOf(".");
      if (-1 !== a2) {
        var u2 = e2[t2.substr(0, a2)];
        return void 0 === u2 ? void 0 : x(u2, t2.substr(a2 + 1));
      }
    }
    function O(e2, t2, n2) {
      if (e2 && void 0 !== t2 && !("isFrozen" in Object && Object.isFrozen(e2)))
        if ("string" != typeof t2 && "length" in t2) {
          b("string" != typeof n2 && "length" in n2);
          for (var r2 = 0, i2 = t2.length; r2 < i2; ++r2)
            O(e2, t2[r2], n2[r2]);
        } else {
          var o2, a2, u2 = t2.indexOf(".");
          -1 !== u2 ? (o2 = t2.substr(0, u2), "" === (a2 = t2.substr(u2 + 1)) ? void 0 === n2 ? g(e2) && !isNaN(parseInt(o2)) ? e2.splice(o2, 1) : delete e2[o2] : e2[o2] = n2 : O(u2 = !(u2 = e2[o2]) || !m(e2, o2) ? e2[o2] = {} : u2, a2, n2)) : void 0 === n2 ? g(e2) && !isNaN(parseInt(t2)) ? e2.splice(t2, 1) : delete e2[t2] : e2[t2] = n2;
        }
    }
    function P(e2) {
      var t2, n2 = {};
      for (t2 in e2)
        m(e2, t2) && (n2[t2] = e2[t2]);
      return n2;
    }
    var t = [].concat;
    function E(e2) {
      return t.apply([], e2);
    }
    var e = "Array,Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,FileSystemDirectoryHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(E([8, 16, 32, 64].map(function(t2) {
      return ["Int", "Uint", "Float"].map(function(e2) {
        return e2 + t2 + "Array";
      });
    }))).filter(function(e2) {
      return f[e2];
    }), K = new Set(e.map(function(e2) {
      return f[e2];
    }));
    var S = null;
    function j(e2) {
      S = /* @__PURE__ */ new WeakMap();
      e2 = function e3(t2) {
        if (!t2 || "object" != typeof t2)
          return t2;
        var n2 = S.get(t2);
        if (n2)
          return n2;
        if (g(t2)) {
          n2 = [], S.set(t2, n2);
          for (var r2 = 0, i2 = t2.length; r2 < i2; ++r2)
            n2.push(e3(t2[r2]));
        } else if (K.has(t2.constructor))
          n2 = t2;
        else {
          var o2, a2 = c(t2);
          for (o2 in n2 = a2 === Object.prototype ? {} : Object.create(a2), S.set(t2, n2), t2)
            m(t2, o2) && (n2[o2] = e3(t2[o2]));
        }
        return n2;
      }(e2);
      return S = null, e2;
    }
    var A = {}.toString;
    function C(e2) {
      return A.call(e2).slice(8, -1);
    }
    var q = "undefined" != typeof Symbol ? Symbol.iterator : "@@iterator", D = "symbol" == typeof q ? function(e2) {
      var t2;
      return null != e2 && (t2 = e2[q]) && t2.apply(e2);
    } : function() {
      return null;
    };
    function T(e2, t2) {
      t2 = e2.indexOf(t2);
      return 0 <= t2 && e2.splice(t2, 1), 0 <= t2;
    }
    var I = {};
    function R(e2) {
      var t2, n2, r2, i2;
      if (1 === arguments.length) {
        if (g(e2))
          return e2.slice();
        if (this === I && "string" == typeof e2)
          return [e2];
        if (i2 = D(e2)) {
          for (n2 = []; !(r2 = i2.next()).done; )
            n2.push(r2.value);
          return n2;
        }
        if (null == e2)
          return [e2];
        if ("number" != typeof (t2 = e2.length))
          return [e2];
        for (n2 = new Array(t2); t2--; )
          n2[t2] = e2[t2];
        return n2;
      }
      for (t2 = arguments.length, n2 = new Array(t2); t2--; )
        n2[t2] = arguments[t2];
      return n2;
    }
    var B = "undefined" != typeof Symbol ? function(e2) {
      return "AsyncFunction" === e2[Symbol.toStringTag];
    } : function() {
      return false;
    }, F = "undefined" != typeof location && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
    function M(e2, t2) {
      F = e2, N = t2;
    }
    var N = function() {
      return true;
    }, L = !new Error("").stack;
    function U() {
      if (L)
        try {
          throw new Error();
        } catch (e2) {
          return e2;
        }
      return new Error();
    }
    function z(e2, t2) {
      var n2 = e2.stack;
      return n2 ? (t2 = t2 || 0, 0 === n2.indexOf(e2.name) && (t2 += (e2.name + e2.message).split("\n").length), n2.split("\n").slice(t2).filter(N).map(function(e3) {
        return "\n" + e3;
      }).join("")) : "";
    }
    var V = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"], W = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"].concat(V), Y = { VersionChanged: "Database version changed by other database connection", DatabaseClosed: "Database has been closed", Abort: "Transaction aborted", TransactionInactive: "Transaction has already completed or failed", MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb" };
    function Q(e2, t2) {
      this._e = U(), this.name = e2, this.message = t2;
    }
    function G(e2, t2) {
      return e2 + ". Errors: " + Object.keys(t2).map(function(e3) {
        return t2[e3].toString();
      }).filter(function(e3, t3, n2) {
        return n2.indexOf(e3) === t3;
      }).join("\n");
    }
    function H(e2, t2, n2, r2) {
      this._e = U(), this.failures = t2, this.failedKeys = r2, this.successCount = n2, this.message = G(e2, t2);
    }
    function X(e2, t2) {
      this._e = U(), this.name = "BulkError", this.failures = Object.keys(t2).map(function(e3) {
        return t2[e3];
      }), this.failuresByPos = t2, this.message = G(e2, this.failures);
    }
    o(Q).from(Error).extend({ stack: { get: function() {
      return this._stack || (this._stack = this.name + ": " + this.message + z(this._e, 2));
    } }, toString: function() {
      return this.name + ": " + this.message;
    } }), o(H).from(Q), o(X).from(Q);
    var J = W.reduce(function(e2, t2) {
      return e2[t2] = t2 + "Error", e2;
    }, {}), $ = Q, Z = W.reduce(function(e2, n2) {
      var r2 = n2 + "Error";
      function t2(e3, t3) {
        this._e = U(), this.name = r2, e3 ? "string" == typeof e3 ? (this.message = "".concat(e3).concat(t3 ? "\n " + t3 : ""), this.inner = t3 || null) : "object" == typeof e3 && (this.message = "".concat(e3.name, " ").concat(e3.message), this.inner = e3) : (this.message = Y[n2] || r2, this.inner = null);
      }
      return o(t2).from($), e2[n2] = t2, e2;
    }, {});
    Z.Syntax = SyntaxError, Z.Type = TypeError, Z.Range = RangeError;
    var ee = V.reduce(function(e2, t2) {
      return e2[t2 + "Error"] = Z[t2], e2;
    }, {});
    var te = W.reduce(function(e2, t2) {
      return -1 === ["Syntax", "Type", "Range"].indexOf(t2) && (e2[t2 + "Error"] = Z[t2]), e2;
    }, {});
    function ne() {
    }
    function re(e2) {
      return e2;
    }
    function ie(t2, n2) {
      return null == t2 || t2 === re ? n2 : function(e2) {
        return n2(t2(e2));
      };
    }
    function oe(e2, t2) {
      return function() {
        e2.apply(this, arguments), t2.apply(this, arguments);
      };
    }
    function ae(i2, o2) {
      return i2 === ne ? o2 : function() {
        var e2 = i2.apply(this, arguments);
        void 0 !== e2 && (arguments[0] = e2);
        var t2 = this.onsuccess, n2 = this.onerror;
        this.onsuccess = null, this.onerror = null;
        var r2 = o2.apply(this, arguments);
        return t2 && (this.onsuccess = this.onsuccess ? oe(t2, this.onsuccess) : t2), n2 && (this.onerror = this.onerror ? oe(n2, this.onerror) : n2), void 0 !== r2 ? r2 : e2;
      };
    }
    function ue(n2, r2) {
      return n2 === ne ? r2 : function() {
        n2.apply(this, arguments);
        var e2 = this.onsuccess, t2 = this.onerror;
        this.onsuccess = this.onerror = null, r2.apply(this, arguments), e2 && (this.onsuccess = this.onsuccess ? oe(e2, this.onsuccess) : e2), t2 && (this.onerror = this.onerror ? oe(t2, this.onerror) : t2);
      };
    }
    function se(i2, o2) {
      return i2 === ne ? o2 : function(e2) {
        var t2 = i2.apply(this, arguments);
        a(e2, t2);
        var n2 = this.onsuccess, r2 = this.onerror;
        this.onsuccess = null, this.onerror = null;
        e2 = o2.apply(this, arguments);
        return n2 && (this.onsuccess = this.onsuccess ? oe(n2, this.onsuccess) : n2), r2 && (this.onerror = this.onerror ? oe(r2, this.onerror) : r2), void 0 === t2 ? void 0 === e2 ? void 0 : e2 : a(t2, e2);
      };
    }
    function ce(e2, t2) {
      return e2 === ne ? t2 : function() {
        return false !== t2.apply(this, arguments) && e2.apply(this, arguments);
      };
    }
    function le(i2, o2) {
      return i2 === ne ? o2 : function() {
        var e2 = i2.apply(this, arguments);
        if (e2 && "function" == typeof e2.then) {
          for (var t2 = this, n2 = arguments.length, r2 = new Array(n2); n2--; )
            r2[n2] = arguments[n2];
          return e2.then(function() {
            return o2.apply(t2, r2);
          });
        }
        return o2.apply(this, arguments);
      };
    }
    te.ModifyError = H, te.DexieError = Q, te.BulkError = X;
    var fe = {}, he = 100, de = 100, e = "undefined" == typeof Promise ? [] : function() {
      var e2 = Promise.resolve();
      if ("undefined" == typeof crypto || !crypto.subtle)
        return [e2, c(e2), e2];
      var t2 = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
      return [t2, c(t2), e2];
    }(), V = e[0], W = e[1], e = e[2], W = W && W.then, pe = V && V.constructor, ye = !!e, ve = false;
    var me = function(e2, t2) {
      Ee.push([e2, t2]), ge && (queueMicrotask(Be), ge = false);
    }, be = true, ge = true, we = [], _e = [], ke = null, xe = re, Oe = { id: "global", global: true, ref: 0, unhandleds: [], onunhandled: ne, pgp: false, env: {}, finalize: ne }, Pe = Oe, Ee = [], Ke = 0, Se = [];
    function je(e2) {
      if ("object" != typeof this)
        throw new TypeError("Promises must be constructed via new");
      this._listeners = [], this._lib = false;
      var t2 = this._PSD = Pe;
      if (F && (this._stackHolder = U(), this._prev = null, this._numPrev = 0), "function" != typeof e2) {
        if (e2 !== fe)
          throw new TypeError("Not a function");
        return this._state = arguments[1], this._value = arguments[2], void (false === this._state && qe(this, this._value));
      }
      this._state = null, this._value = null, ++t2.ref, function t3(r2, e3) {
        try {
          e3(function(n2) {
            if (null === r2._state) {
              if (n2 === r2)
                throw new TypeError("A promise cannot be resolved with itself.");
              var e4 = r2._lib && Fe();
              n2 && "function" == typeof n2.then ? t3(r2, function(e5, t4) {
                n2 instanceof je ? n2._then(e5, t4) : n2.then(e5, t4);
              }) : (r2._state = true, r2._value = n2, De(r2)), e4 && Me();
            }
          }, qe.bind(null, r2));
        } catch (e4) {
          qe(r2, e4);
        }
      }(this, e2);
    }
    var Ae = { get: function() {
      var u2 = Pe, t2 = Qe;
      function e2(n2, r2) {
        var i2 = this, o2 = !u2.global && (u2 !== Pe || t2 !== Qe), a2 = o2 && !Je(), e3 = new je(function(e4, t3) {
          Te(i2, new Ce(rt(n2, u2, o2, a2), rt(r2, u2, o2, a2), e4, t3, u2));
        });
        return F && Re(e3, this), e3;
      }
      return e2.prototype = fe, e2;
    }, set: function(e2) {
      l(this, "then", e2 && e2.prototype === fe ? Ae : { get: function() {
        return e2;
      }, set: Ae.set });
    } };
    function Ce(e2, t2, n2, r2, i2) {
      this.onFulfilled = "function" == typeof e2 ? e2 : null, this.onRejected = "function" == typeof t2 ? t2 : null, this.resolve = n2, this.reject = r2, this.psd = i2;
    }
    function qe(t2, n2) {
      var e2, r2;
      _e.push(n2), null === t2._state && (e2 = t2._lib && Fe(), n2 = xe(n2), t2._state = false, t2._value = n2, F && null !== n2 && "object" == typeof n2 && !n2._promise && function(e3, t3, n3) {
        try {
          e3.apply(null, n3);
        } catch (e4) {
          t3 && t3(e4);
        }
      }(function() {
        var e3 = d(n2, "stack");
        n2._promise = t2, l(n2, "stack", { get: function() {
          return ve ? e3 && (e3.get ? e3.get.apply(n2) : e3.value) : t2.stack;
        } });
      }), r2 = t2, we.some(function(e3) {
        return e3._value === r2._value;
      }) || we.push(r2), De(t2), e2 && Me());
    }
    function De(e2) {
      var t2 = e2._listeners;
      e2._listeners = [];
      for (var n2 = 0, r2 = t2.length; n2 < r2; ++n2)
        Te(e2, t2[n2]);
      var i2 = e2._PSD;
      --i2.ref || i2.finalize(), 0 === Ke && (++Ke, me(function() {
        0 == --Ke && Ne();
      }, []));
    }
    function Te(e2, t2) {
      if (null !== e2._state) {
        var n2 = e2._state ? t2.onFulfilled : t2.onRejected;
        if (null === n2)
          return (e2._state ? t2.resolve : t2.reject)(e2._value);
        ++t2.psd.ref, ++Ke, me(Ie, [n2, e2, t2]);
      } else
        e2._listeners.push(t2);
    }
    function Ie(e2, t2, n2) {
      try {
        var r2, i2 = (ke = t2)._value;
        t2._state ? r2 = e2(i2) : (_e.length && (_e = []), r2 = e2(i2), -1 === _e.indexOf(i2) && function(e3) {
          var t3 = we.length;
          for (; t3; )
            if (we[--t3]._value === e3._value)
              return we.splice(t3, 1);
        }(t2)), n2.resolve(r2);
      } catch (e3) {
        n2.reject(e3);
      } finally {
        ke = null, 0 == --Ke && Ne(), --n2.psd.ref || n2.psd.finalize();
      }
    }
    function Re(e2, t2) {
      var n2 = t2 ? t2._numPrev + 1 : 0;
      n2 < he && (e2._prev = t2, e2._numPrev = n2);
    }
    function Be() {
      nt(Oe, function() {
        Fe() && Me();
      });
    }
    function Fe() {
      var e2 = be;
      return ge = be = false, e2;
    }
    function Me() {
      var e2, t2, n2;
      do {
        for (; 0 < Ee.length; )
          for (e2 = Ee, Ee = [], n2 = e2.length, t2 = 0; t2 < n2; ++t2) {
            var r2 = e2[t2];
            r2[0].apply(null, r2[1]);
          }
      } while (0 < Ee.length);
      ge = be = true;
    }
    function Ne() {
      var e2 = we;
      we = [], e2.forEach(function(e3) {
        e3._PSD.onunhandled.call(null, e3._value, e3);
      });
      for (var t2 = Se.slice(0), n2 = t2.length; n2; )
        t2[--n2]();
    }
    function Le(e2) {
      return new je(fe, false, e2);
    }
    function Ue(n2, r2) {
      var i2 = Pe;
      return function() {
        var e2 = Fe(), t2 = Pe;
        try {
          return et(i2, true), n2.apply(this, arguments);
        } catch (e3) {
          r2 && r2(e3);
        } finally {
          et(t2, false), e2 && Me();
        }
      };
    }
    r(je.prototype, { then: Ae, _then: function(e2, t2) {
      Te(this, new Ce(null, null, e2, t2, Pe));
    }, catch: function(e2) {
      if (1 === arguments.length)
        return this.then(null, e2);
      var t2 = e2, n2 = arguments[1];
      return "function" == typeof t2 ? this.then(null, function(e3) {
        return (e3 instanceof t2 ? n2 : Le)(e3);
      }) : this.then(null, function(e3) {
        return (e3 && e3.name === t2 ? n2 : Le)(e3);
      });
    }, finally: function(t2) {
      return this.then(function(e2) {
        return je.resolve(t2()).then(function() {
          return e2;
        });
      }, function(e2) {
        return je.resolve(t2()).then(function() {
          return Le(e2);
        });
      });
    }, stack: { get: function() {
      if (this._stack)
        return this._stack;
      try {
        ve = true;
        var e2 = function e3(t2, n2, r2) {
          if (n2.length === r2)
            return n2;
          var i2 = "";
          {
            var o2, a2, u2;
            false === t2._state && (null != (o2 = t2._value) ? (a2 = o2.name || "Error", u2 = o2.message || o2, i2 = z(o2, 0)) : (a2 = o2, u2 = ""), n2.push(a2 + (u2 ? ": " + u2 : "") + i2));
          }
          F && ((i2 = z(t2._stackHolder, 2)) && -1 === n2.indexOf(i2) && n2.push(i2), t2._prev && e3(t2._prev, n2, r2));
          return n2;
        }(this, [], 20).join("\nFrom previous: ");
        return null !== this._state && (this._stack = e2), e2;
      } finally {
        ve = false;
      }
    } }, timeout: function(r2, i2) {
      var o2 = this;
      return r2 < 1 / 0 ? new je(function(e2, t2) {
        var n2 = setTimeout(function() {
          return t2(new Z.Timeout(i2));
        }, r2);
        o2.then(e2, t2).finally(clearTimeout.bind(null, n2));
      }) : this;
    } }), "undefined" != typeof Symbol && Symbol.toStringTag && l(je.prototype, Symbol.toStringTag, "Dexie.Promise"), Oe.env = tt(), r(je, { all: function() {
      var o2 = R.apply(null, arguments).map($e);
      return new je(function(n2, r2) {
        0 === o2.length && n2([]);
        var i2 = o2.length;
        o2.forEach(function(e2, t2) {
          return je.resolve(e2).then(function(e3) {
            o2[t2] = e3, --i2 || n2(o2);
          }, r2);
        });
      });
    }, resolve: function(n2) {
      if (n2 instanceof je)
        return n2;
      if (n2 && "function" == typeof n2.then)
        return new je(function(e3, t2) {
          n2.then(e3, t2);
        });
      var e2 = new je(fe, true, n2);
      return Re(e2, ke), e2;
    }, reject: Le, race: function() {
      var e2 = R.apply(null, arguments).map($e);
      return new je(function(t2, n2) {
        e2.map(function(e3) {
          return je.resolve(e3).then(t2, n2);
        });
      });
    }, PSD: { get: function() {
      return Pe;
    }, set: function(e2) {
      return Pe = e2;
    } }, totalEchoes: { get: function() {
      return Qe;
    } }, newPSD: He, usePSD: nt, scheduler: { get: function() {
      return me;
    }, set: function(e2) {
      me = e2;
    } }, rejectionMapper: { get: function() {
      return xe;
    }, set: function(e2) {
      xe = e2;
    } }, follow: function(i2, n2) {
      return new je(function(e2, t2) {
        return He(function(n3, r2) {
          var e3 = Pe;
          e3.unhandleds = [], e3.onunhandled = r2, e3.finalize = oe(function() {
            var t3, e4 = this;
            t3 = function() {
              0 === e4.unhandleds.length ? n3() : r2(e4.unhandleds[0]);
            }, Se.push(function e5() {
              t3(), Se.splice(Se.indexOf(e5), 1);
            }), ++Ke, me(function() {
              0 == --Ke && Ne();
            }, []);
          }, e3.finalize), i2();
        }, n2, e2, t2);
      });
    } }), pe && (pe.allSettled && l(je, "allSettled", function() {
      var e2 = R.apply(null, arguments).map($e);
      return new je(function(n2) {
        0 === e2.length && n2([]);
        var r2 = e2.length, i2 = new Array(r2);
        e2.forEach(function(e3, t2) {
          return je.resolve(e3).then(function(e4) {
            return i2[t2] = { status: "fulfilled", value: e4 };
          }, function(e4) {
            return i2[t2] = { status: "rejected", reason: e4 };
          }).then(function() {
            return --r2 || n2(i2);
          });
        });
      });
    }), pe.any && "undefined" != typeof AggregateError && l(je, "any", function() {
      var e2 = R.apply(null, arguments).map($e);
      return new je(function(n2, r2) {
        0 === e2.length && r2(new AggregateError([]));
        var i2 = e2.length, o2 = new Array(i2);
        e2.forEach(function(e3, t2) {
          return je.resolve(e3).then(function(e4) {
            return n2(e4);
          }, function(e4) {
            o2[t2] = e4, --i2 || r2(new AggregateError(o2));
          });
        });
      });
    }));
    var ze = { awaits: 0, echoes: 0, id: 0 }, Ve = 0, We = [], Ye = 0, Qe = 0, Ge = 0;
    function He(e2, t2, n2, r2) {
      var i2 = Pe, o2 = Object.create(i2);
      o2.parent = i2, o2.ref = 0, o2.global = false, o2.id = ++Ge, Oe.env, o2.env = ye ? { Promise: je, PromiseProp: { value: je, configurable: true, writable: true }, all: je.all, race: je.race, allSettled: je.allSettled, any: je.any, resolve: je.resolve, reject: je.reject } : {}, t2 && a(o2, t2), ++i2.ref, o2.finalize = function() {
        --this.parent.ref || this.parent.finalize();
      };
      r2 = nt(o2, e2, n2, r2);
      return 0 === o2.ref && o2.finalize(), r2;
    }
    function Xe() {
      return ze.id || (ze.id = ++Ve), ++ze.awaits, ze.echoes += de, ze.id;
    }
    function Je() {
      return !!ze.awaits && (0 == --ze.awaits && (ze.id = 0), ze.echoes = ze.awaits * de, true);
    }
    function $e(e2) {
      return ze.echoes && e2 && e2.constructor === pe ? (Xe(), e2.then(function(e3) {
        return Je(), e3;
      }, function(e3) {
        return Je(), ot(e3);
      })) : e2;
    }
    function Ze() {
      var e2 = We[We.length - 1];
      We.pop(), et(e2, false);
    }
    function et(e2, t2) {
      var n2, r2 = Pe;
      (t2 ? !ze.echoes || Ye++ && e2 === Pe : !Ye || --Ye && e2 === Pe) || queueMicrotask(t2 ? (function(e3) {
        ++Qe, ze.echoes && 0 != --ze.echoes || (ze.echoes = ze.awaits = ze.id = 0), We.push(Pe), et(e3, true);
      }).bind(null, e2) : Ze), e2 !== Pe && (Pe = e2, r2 === Oe && (Oe.env = tt()), ye && (n2 = Oe.env.Promise, t2 = e2.env, (r2.global || e2.global) && (Object.defineProperty(f, "Promise", t2.PromiseProp), n2.all = t2.all, n2.race = t2.race, n2.resolve = t2.resolve, n2.reject = t2.reject, t2.allSettled && (n2.allSettled = t2.allSettled), t2.any && (n2.any = t2.any))));
    }
    function tt() {
      var e2 = f.Promise;
      return ye ? { Promise: e2, PromiseProp: Object.getOwnPropertyDescriptor(f, "Promise"), all: e2.all, race: e2.race, allSettled: e2.allSettled, any: e2.any, resolve: e2.resolve, reject: e2.reject } : {};
    }
    function nt(e2, t2, n2, r2, i2) {
      var o2 = Pe;
      try {
        return et(e2, true), t2(n2, r2, i2);
      } finally {
        et(o2, false);
      }
    }
    function rt(t2, n2, r2, i2) {
      return "function" != typeof t2 ? t2 : function() {
        var e2 = Pe;
        r2 && Xe(), et(n2, true);
        try {
          return t2.apply(this, arguments);
        } finally {
          et(e2, false), i2 && queueMicrotask(Je);
        }
      };
    }
    function it(e2) {
      Promise === pe && 0 === ze.echoes ? 0 === Ye ? e2() : enqueueNativeMicroTask(e2) : setTimeout(e2, 0);
    }
    -1 === ("" + W).indexOf("[native code]") && (Xe = Je = ne);
    var ot = je.reject;
    function at(e2) {
      return !/(dexie\.js|dexie\.min\.js)/.test(e2);
    }
    var e = "4.0.1-beta.6", ut = String.fromCharCode(65535), st = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.", ct = "String expected.", lt = [], ft = "undefined" != typeof navigator && /(MSIE|Trident|Edge)/.test(navigator.userAgent), ht = ft, dt = ft, pt = "__dbnames", yt = "readonly", vt = "readwrite";
    function mt(e2, t2) {
      return e2 ? t2 ? function() {
        return e2.apply(this, arguments) && t2.apply(this, arguments);
      } : e2 : t2;
    }
    var bt = { type: 3, lower: -1 / 0, lowerOpen: false, upper: [[]], upperOpen: false };
    function gt(t2) {
      return "string" != typeof t2 || /\./.test(t2) ? function(e2) {
        return e2;
      } : function(e2) {
        return void 0 === e2[t2] && t2 in e2 && delete (e2 = j(e2))[t2], e2;
      };
    }
    function wt() {
      throw Z.Type();
    }
    function _t(e2, t2) {
      try {
        var n2 = kt(e2), r2 = kt(t2);
        if (n2 !== r2)
          return "Array" === n2 ? 1 : "Array" === r2 ? -1 : "binary" === n2 ? 1 : "binary" === r2 ? -1 : "string" === n2 ? 1 : "string" === r2 ? -1 : "Date" === n2 ? 1 : "Date" !== r2 ? NaN : -1;
        switch (n2) {
          case "number":
          case "Date":
          case "string":
            return t2 < e2 ? 1 : e2 < t2 ? -1 : 0;
          case "binary":
            return function(e3, t3) {
              for (var n3 = e3.length, r3 = t3.length, i2 = n3 < r3 ? n3 : r3, o2 = 0; o2 < i2; ++o2)
                if (e3[o2] !== t3[o2])
                  return e3[o2] < t3[o2] ? -1 : 1;
              return n3 === r3 ? 0 : n3 < r3 ? -1 : 1;
            }(xt(e2), xt(t2));
          case "Array":
            return function(e3, t3) {
              for (var n3 = e3.length, r3 = t3.length, i2 = n3 < r3 ? n3 : r3, o2 = 0; o2 < i2; ++o2) {
                var a2 = _t(e3[o2], t3[o2]);
                if (0 !== a2)
                  return a2;
              }
              return n3 === r3 ? 0 : n3 < r3 ? -1 : 1;
            }(e2, t2);
        }
      } catch (e3) {
      }
      return NaN;
    }
    function kt(e2) {
      var t2 = typeof e2;
      if ("object" != t2)
        return t2;
      if (ArrayBuffer.isView(e2))
        return "binary";
      e2 = C(e2);
      return "ArrayBuffer" === e2 ? "binary" : e2;
    }
    function xt(e2) {
      return e2 instanceof Uint8Array ? e2 : ArrayBuffer.isView(e2) ? new Uint8Array(e2.buffer, e2.byteOffset, e2.byteLength) : new Uint8Array(e2);
    }
    var Ot = (Pt.prototype._trans = function(e2, r2, t2) {
      var n2 = this._tx || Pe.trans, i2 = this.name;
      function o2(e3, t3, n3) {
        if (!n3.schema[i2])
          throw new Z.NotFound("Table " + i2 + " not part of transaction");
        return r2(n3.idbtrans, n3);
      }
      var a2 = Fe();
      try {
        return n2 && n2.db._novip === this.db._novip ? n2 === Pe.trans ? n2._promise(e2, o2, t2) : He(function() {
          return n2._promise(e2, o2, t2);
        }, { trans: n2, transless: Pe.transless || Pe }) : function t3(n3, r3, i3, o3) {
          if (n3.idbdb && (n3._state.openComplete || Pe.letThrough || n3._vip)) {
            var a3 = n3._createTransaction(r3, i3, n3._dbSchema);
            try {
              a3.create(), n3._state.PR1398_maxLoop = 3;
            } catch (e3) {
              return e3.name === J.InvalidState && n3.isOpen() && 0 < --n3._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), n3._close(), n3.open().then(function() {
                return t3(n3, r3, i3, o3);
              })) : ot(e3);
            }
            return a3._promise(r3, function(e3, t4) {
              return He(function() {
                return Pe.trans = a3, o3(e3, t4, a3);
              });
            }).then(function(e3) {
              if ("readwrite" === r3)
                try {
                  a3.idbtrans.commit();
                } catch (e4) {
                }
              return "readonly" === r3 ? e3 : a3._completion.then(function() {
                return e3;
              });
            });
          }
          if (n3._state.openComplete)
            return ot(new Z.DatabaseClosed(n3._state.dbOpenError));
          if (!n3._state.isBeingOpened) {
            if (!n3._options.autoOpen)
              return ot(new Z.DatabaseClosed());
            n3.open().catch(ne);
          }
          return n3._state.dbReadyPromise.then(function() {
            return t3(n3, r3, i3, o3);
          });
        }(this.db, e2, [this.name], o2);
      } finally {
        a2 && Me();
      }
    }, Pt.prototype.get = function(t2, e2) {
      var n2 = this;
      return t2 && t2.constructor === Object ? this.where(t2).first(e2) : this._trans("readonly", function(e3) {
        return n2.core.get({ trans: e3, key: t2 }).then(function(e4) {
          return n2.hook.reading.fire(e4);
        });
      }).then(e2);
    }, Pt.prototype.where = function(o2) {
      if ("string" == typeof o2)
        return new this.db.WhereClause(this, o2);
      if (g(o2))
        return new this.db.WhereClause(this, "[".concat(o2.join("+"), "]"));
      var n2 = k(o2);
      if (1 === n2.length)
        return this.where(n2[0]).equals(o2[n2[0]]);
      var e2 = this.schema.indexes.concat(this.schema.primKey).filter(function(t3) {
        if (t3.compound && n2.every(function(e4) {
          return 0 <= t3.keyPath.indexOf(e4);
        })) {
          for (var e3 = 0; e3 < n2.length; ++e3)
            if (-1 === n2.indexOf(t3.keyPath[e3]))
              return false;
          return true;
        }
        return false;
      }).sort(function(e3, t3) {
        return e3.keyPath.length - t3.keyPath.length;
      })[0];
      if (e2 && this.db._maxKey !== ut) {
        var t2 = e2.keyPath.slice(0, n2.length);
        return this.where(t2).equals(t2.map(function(e3) {
          return o2[e3];
        }));
      }
      !e2 && F && console.warn("The query ".concat(JSON.stringify(o2), " on ").concat(this.name, " would benefit of a ") + "compound index [".concat(n2.join("+"), "]"));
      var a2 = this.schema.idxByName, r2 = this.db._deps.indexedDB;
      function u2(e3, t3) {
        return 0 === r2.cmp(e3, t3);
      }
      var i2 = n2.reduce(function(e3, t3) {
        var n3 = e3[0], r3 = e3[1], e3 = a2[t3], i3 = o2[t3];
        return [n3 || e3, n3 || !e3 ? mt(r3, e3 && e3.multi ? function(e4) {
          e4 = x(e4, t3);
          return g(e4) && e4.some(function(e5) {
            return u2(i3, e5);
          });
        } : function(e4) {
          return u2(i3, x(e4, t3));
        }) : r3];
      }, [null, null]), t2 = i2[0], i2 = i2[1];
      return t2 ? this.where(t2.name).equals(o2[t2.keyPath]).filter(i2) : e2 ? this.filter(i2) : this.where(n2).equals("");
    }, Pt.prototype.filter = function(e2) {
      return this.toCollection().and(e2);
    }, Pt.prototype.count = function(e2) {
      return this.toCollection().count(e2);
    }, Pt.prototype.offset = function(e2) {
      return this.toCollection().offset(e2);
    }, Pt.prototype.limit = function(e2) {
      return this.toCollection().limit(e2);
    }, Pt.prototype.each = function(e2) {
      return this.toCollection().each(e2);
    }, Pt.prototype.toArray = function(e2) {
      return this.toCollection().toArray(e2);
    }, Pt.prototype.toCollection = function() {
      return new this.db.Collection(new this.db.WhereClause(this));
    }, Pt.prototype.orderBy = function(e2) {
      return new this.db.Collection(new this.db.WhereClause(this, g(e2) ? "[".concat(e2.join("+"), "]") : e2));
    }, Pt.prototype.reverse = function() {
      return this.toCollection().reverse();
    }, Pt.prototype.mapToClass = function(r2) {
      var e2, t2 = this.db, n2 = this.name;
      function i2() {
        return null !== e2 && e2.apply(this, arguments) || this;
      }
      (this.schema.mappedClass = r2).prototype instanceof wt && (function(e3, t3) {
        if ("function" != typeof t3 && null !== t3)
          throw new TypeError("Class extends value " + String(t3) + " is not a constructor or null");
        function n3() {
          this.constructor = e3;
        }
        s(e3, t3), e3.prototype = null === t3 ? Object.create(t3) : (n3.prototype = t3.prototype, new n3());
      }(i2, e2 = r2), Object.defineProperty(i2.prototype, "db", { get: function() {
        return t2;
      }, enumerable: false, configurable: true }), i2.prototype.table = function() {
        return n2;
      }, r2 = i2);
      for (var o2 = /* @__PURE__ */ new Set(), a2 = r2.prototype; a2; a2 = c(a2))
        Object.getOwnPropertyNames(a2).forEach(function(e3) {
          return o2.add(e3);
        });
      function u2(e3) {
        if (!e3)
          return e3;
        var t3, n3 = Object.create(r2.prototype);
        for (t3 in e3)
          if (!o2.has(t3))
            try {
              n3[t3] = e3[t3];
            } catch (e4) {
            }
        return n3;
      }
      return this.schema.readHook && this.hook.reading.unsubscribe(this.schema.readHook), this.schema.readHook = u2, this.hook("reading", u2), r2;
    }, Pt.prototype.defineClass = function() {
      return this.mapToClass(function(e2) {
        a(this, e2);
      });
    }, Pt.prototype.add = function(t2, n2) {
      var r2 = this, e2 = this.schema.primKey, i2 = e2.auto, o2 = e2.keyPath, a2 = t2;
      return o2 && i2 && (a2 = gt(o2)(t2)), this._trans("readwrite", function(e3) {
        return r2.core.mutate({ trans: e3, type: "add", keys: null != n2 ? [n2] : null, values: [a2] });
      }).then(function(e3) {
        return e3.numFailures ? je.reject(e3.failures[0]) : e3.lastResult;
      }).then(function(e3) {
        if (o2)
          try {
            O(t2, o2, e3);
          } catch (e4) {
          }
        return e3;
      });
    }, Pt.prototype.update = function(e2, t2) {
      if ("object" != typeof e2 || g(e2))
        return this.where(":id").equals(e2).modify(t2);
      e2 = x(e2, this.schema.primKey.keyPath);
      return void 0 === e2 ? ot(new Z.InvalidArgument("Given object does not contain its primary key")) : this.where(":id").equals(e2).modify(t2);
    }, Pt.prototype.put = function(t2, n2) {
      var r2 = this, e2 = this.schema.primKey, i2 = e2.auto, o2 = e2.keyPath, a2 = t2;
      return o2 && i2 && (a2 = gt(o2)(t2)), this._trans("readwrite", function(e3) {
        return r2.core.mutate({ trans: e3, type: "put", values: [a2], keys: null != n2 ? [n2] : null });
      }).then(function(e3) {
        return e3.numFailures ? je.reject(e3.failures[0]) : e3.lastResult;
      }).then(function(e3) {
        if (o2)
          try {
            O(t2, o2, e3);
          } catch (e4) {
          }
        return e3;
      });
    }, Pt.prototype.delete = function(t2) {
      var n2 = this;
      return this._trans("readwrite", function(e2) {
        return n2.core.mutate({ trans: e2, type: "delete", keys: [t2] });
      }).then(function(e2) {
        return e2.numFailures ? je.reject(e2.failures[0]) : void 0;
      });
    }, Pt.prototype.clear = function() {
      var t2 = this;
      return this._trans("readwrite", function(e2) {
        return t2.core.mutate({ trans: e2, type: "deleteRange", range: bt });
      }).then(function(e2) {
        return e2.numFailures ? je.reject(e2.failures[0]) : void 0;
      });
    }, Pt.prototype.bulkGet = function(t2) {
      var n2 = this;
      return this._trans("readonly", function(e2) {
        return n2.core.getMany({ keys: t2, trans: e2 }).then(function(e3) {
          return e3.map(function(e4) {
            return n2.hook.reading.fire(e4);
          });
        });
      });
    }, Pt.prototype.bulkAdd = function(r2, e2, t2) {
      var o2 = this, a2 = Array.isArray(e2) ? e2 : void 0, u2 = (t2 = t2 || (a2 ? void 0 : e2)) ? t2.allKeys : void 0;
      return this._trans("readwrite", function(e3) {
        var t3 = o2.schema.primKey, n2 = t3.auto, t3 = t3.keyPath;
        if (t3 && a2)
          throw new Z.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
        if (a2 && a2.length !== r2.length)
          throw new Z.InvalidArgument("Arguments objects and keys must have the same length");
        var i2 = r2.length, t3 = t3 && n2 ? r2.map(gt(t3)) : r2;
        return o2.core.mutate({ trans: e3, type: "add", keys: a2, values: t3, wantResults: u2 }).then(function(e4) {
          var t4 = e4.numFailures, n3 = e4.results, r3 = e4.lastResult, e4 = e4.failures;
          if (0 === t4)
            return u2 ? n3 : r3;
          throw new X("".concat(o2.name, ".bulkAdd(): ").concat(t4, " of ").concat(i2, " operations failed"), e4);
        });
      });
    }, Pt.prototype.bulkPut = function(r2, e2, t2) {
      var o2 = this, a2 = Array.isArray(e2) ? e2 : void 0, u2 = (t2 = t2 || (a2 ? void 0 : e2)) ? t2.allKeys : void 0;
      return this._trans("readwrite", function(e3) {
        var t3 = o2.schema.primKey, n2 = t3.auto, t3 = t3.keyPath;
        if (t3 && a2)
          throw new Z.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
        if (a2 && a2.length !== r2.length)
          throw new Z.InvalidArgument("Arguments objects and keys must have the same length");
        var i2 = r2.length, t3 = t3 && n2 ? r2.map(gt(t3)) : r2;
        return o2.core.mutate({ trans: e3, type: "put", keys: a2, values: t3, wantResults: u2 }).then(function(e4) {
          var t4 = e4.numFailures, n3 = e4.results, r3 = e4.lastResult, e4 = e4.failures;
          if (0 === t4)
            return u2 ? n3 : r3;
          throw new X("".concat(o2.name, ".bulkPut(): ").concat(t4, " of ").concat(i2, " operations failed"), e4);
        });
      });
    }, Pt.prototype.bulkUpdate = function(t2) {
      var h2 = this, n2 = this.core, r2 = t2.map(function(e2) {
        return e2.key;
      }), i2 = t2.map(function(e2) {
        return e2.changes;
      }), d2 = [];
      return this._trans("readwrite", function(e2) {
        return n2.getMany({ trans: e2, keys: r2, cache: "clone" }).then(function(c2) {
          var l2 = [], f2 = [];
          t2.forEach(function(e3, t3) {
            var n3 = e3.key, r3 = e3.changes, i3 = c2[t3];
            if (i3) {
              for (var o2 = 0, a2 = Object.keys(r3); o2 < a2.length; o2++) {
                var u2 = a2[o2], s3 = r3[u2];
                if (u2 === h2.schema.primKey.keyPath) {
                  if (0 !== _t(s3, n3))
                    throw new Z.Constraint("Cannot update primary key in bulkUpdate()");
                } else
                  O(i3, u2, s3);
              }
              d2.push(t3), l2.push(n3), f2.push(i3);
            }
          });
          var s2 = l2.length;
          return n2.mutate({ trans: e2, type: "put", keys: l2, values: f2, updates: { keys: r2, changeSpecs: i2 } }).then(function(e3) {
            var t3 = e3.numFailures, n3 = e3.failures;
            if (0 === t3)
              return s2;
            for (var r3 = 0, i3 = Object.keys(n3); r3 < i3.length; r3++) {
              var o2, a2 = i3[r3], u2 = d2[Number(a2)];
              null != u2 && (o2 = n3[a2], delete n3[a2], n3[u2] = o2);
            }
            throw new X("".concat(h2.name, ".bulkUpdate(): ").concat(t3, " of ").concat(s2, " operations failed"), n3);
          });
        });
      });
    }, Pt.prototype.bulkDelete = function(t2) {
      var r2 = this, i2 = t2.length;
      return this._trans("readwrite", function(e2) {
        return r2.core.mutate({ trans: e2, type: "delete", keys: t2 });
      }).then(function(e2) {
        var t3 = e2.numFailures, n2 = e2.lastResult, e2 = e2.failures;
        if (0 === t3)
          return n2;
        throw new X("".concat(r2.name, ".bulkDelete(): ").concat(t3, " of ").concat(i2, " operations failed"), e2);
      });
    }, Pt);
    function Pt() {
    }
    function Et(i2) {
      function t2(e3, t3) {
        if (t3) {
          for (var n3 = arguments.length, r2 = new Array(n3 - 1); --n3; )
            r2[n3 - 1] = arguments[n3];
          return a2[e3].subscribe.apply(null, r2), i2;
        }
        if ("string" == typeof e3)
          return a2[e3];
      }
      var a2 = {};
      t2.addEventType = u2;
      for (var e2 = 1, n2 = arguments.length; e2 < n2; ++e2)
        u2(arguments[e2]);
      return t2;
      function u2(e3, n3, r2) {
        if ("object" != typeof e3) {
          var i3;
          n3 = n3 || ce;
          var o2 = { subscribers: [], fire: r2 = r2 || ne, subscribe: function(e4) {
            -1 === o2.subscribers.indexOf(e4) && (o2.subscribers.push(e4), o2.fire = n3(o2.fire, e4));
          }, unsubscribe: function(t3) {
            o2.subscribers = o2.subscribers.filter(function(e4) {
              return e4 !== t3;
            }), o2.fire = o2.subscribers.reduce(n3, r2);
          } };
          return a2[e3] = t2[e3] = o2;
        }
        k(i3 = e3).forEach(function(e4) {
          var t3 = i3[e4];
          if (g(t3))
            u2(e4, i3[e4][0], i3[e4][1]);
          else {
            if ("asap" !== t3)
              throw new Z.InvalidArgument("Invalid event config");
            var n4 = u2(e4, re, function() {
              for (var e5 = arguments.length, t4 = new Array(e5); e5--; )
                t4[e5] = arguments[e5];
              n4.subscribers.forEach(function(e6) {
                w(function() {
                  e6.apply(null, t4);
                });
              });
            });
          }
        });
      }
    }
    function Kt(e2, t2) {
      return o(t2).from({ prototype: e2 }), t2;
    }
    function St(e2, t2) {
      return !(e2.filter || e2.algorithm || e2.or) && (t2 ? e2.justLimit : !e2.replayFilter);
    }
    function jt(e2, t2) {
      e2.filter = mt(e2.filter, t2);
    }
    function At(e2, t2, n2) {
      var r2 = e2.replayFilter;
      e2.replayFilter = r2 ? function() {
        return mt(r2(), t2());
      } : t2, e2.justLimit = n2 && !r2;
    }
    function Ct(e2, t2) {
      if (e2.isPrimKey)
        return t2.primaryKey;
      var n2 = t2.getIndexByKeyPath(e2.index);
      if (!n2)
        throw new Z.Schema("KeyPath " + e2.index + " on object store " + t2.name + " is not indexed");
      return n2;
    }
    function qt(e2, t2, n2) {
      var r2 = Ct(e2, t2.schema);
      return t2.openCursor({ trans: n2, values: !e2.keysOnly, reverse: "prev" === e2.dir, unique: !!e2.unique, query: { index: r2, range: e2.range } });
    }
    function Dt(e2, o2, t2, n2) {
      var a2 = e2.replayFilter ? mt(e2.filter, e2.replayFilter()) : e2.filter;
      if (e2.or) {
        var u2 = {}, r2 = function(e3, t3, n3) {
          var r3, i2;
          a2 && !a2(t3, n3, function(e4) {
            return t3.stop(e4);
          }, function(e4) {
            return t3.fail(e4);
          }) || ("[object ArrayBuffer]" === (i2 = "" + (r3 = t3.primaryKey)) && (i2 = "" + new Uint8Array(r3)), m(u2, i2) || (u2[i2] = true, o2(e3, t3, n3)));
        };
        return Promise.all([e2.or._iterate(r2, t2), Tt(qt(e2, n2, t2), e2.algorithm, r2, !e2.keysOnly && e2.valueMapper)]);
      }
      return Tt(qt(e2, n2, t2), mt(e2.algorithm, a2), o2, !e2.keysOnly && e2.valueMapper);
    }
    function Tt(e2, r2, i2, o2) {
      var a2 = Ue(o2 ? function(e3, t2, n2) {
        return i2(o2(e3), t2, n2);
      } : i2);
      return e2.then(function(n2) {
        if (n2)
          return n2.start(function() {
            var t2 = function() {
              return n2.continue();
            };
            r2 && !r2(n2, function(e3) {
              return t2 = e3;
            }, function(e3) {
              n2.stop(e3), t2 = ne;
            }, function(e3) {
              n2.fail(e3), t2 = ne;
            }) || a2(n2.value, n2, function(e3) {
              return t2 = e3;
            }), t2();
          });
      });
    }
    var It = (Rt.prototype._read = function(e2, t2) {
      var n2 = this._ctx;
      return n2.error ? n2.table._trans(null, ot.bind(null, n2.error)) : n2.table._trans("readonly", e2).then(t2);
    }, Rt.prototype._write = function(e2) {
      var t2 = this._ctx;
      return t2.error ? t2.table._trans(null, ot.bind(null, t2.error)) : t2.table._trans("readwrite", e2, "locked");
    }, Rt.prototype._addAlgorithm = function(e2) {
      var t2 = this._ctx;
      t2.algorithm = mt(t2.algorithm, e2);
    }, Rt.prototype._iterate = function(e2, t2) {
      return Dt(this._ctx, e2, t2, this._ctx.table.core);
    }, Rt.prototype.clone = function(e2) {
      var t2 = Object.create(this.constructor.prototype), n2 = Object.create(this._ctx);
      return e2 && a(n2, e2), t2._ctx = n2, t2;
    }, Rt.prototype.raw = function() {
      return this._ctx.valueMapper = null, this;
    }, Rt.prototype.each = function(t2) {
      var n2 = this._ctx;
      return this._read(function(e2) {
        return Dt(n2, t2, e2, n2.table.core);
      });
    }, Rt.prototype.count = function(e2) {
      var i2 = this;
      return this._read(function(e3) {
        var t2 = i2._ctx, n2 = t2.table.core;
        if (St(t2, true))
          return n2.count({ trans: e3, query: { index: Ct(t2, n2.schema), range: t2.range } }).then(function(e4) {
            return Math.min(e4, t2.limit);
          });
        var r2 = 0;
        return Dt(t2, function() {
          return ++r2, false;
        }, e3, n2).then(function() {
          return r2;
        });
      }).then(e2);
    }, Rt.prototype.sortBy = function(e2, t2) {
      var n2 = e2.split(".").reverse(), r2 = n2[0], i2 = n2.length - 1;
      function o2(e3, t3) {
        return t3 ? o2(e3[n2[t3]], t3 - 1) : e3[r2];
      }
      var a2 = "next" === this._ctx.dir ? 1 : -1;
      function u2(e3, t3) {
        e3 = o2(e3, i2), t3 = o2(t3, i2);
        return e3 < t3 ? -a2 : t3 < e3 ? a2 : 0;
      }
      return this.toArray(function(e3) {
        return e3.sort(u2);
      }).then(t2);
    }, Rt.prototype.toArray = function(e2) {
      var o2 = this;
      return this._read(function(e3) {
        var t2 = o2._ctx;
        if ("next" === t2.dir && St(t2, true) && 0 < t2.limit) {
          var n2 = t2.valueMapper, r2 = Ct(t2, t2.table.core.schema);
          return t2.table.core.query({ trans: e3, limit: t2.limit, values: true, query: { index: r2, range: t2.range } }).then(function(e4) {
            e4 = e4.result;
            return n2 ? e4.map(n2) : e4;
          });
        }
        var i2 = [];
        return Dt(t2, function(e4) {
          return i2.push(e4);
        }, e3, t2.table.core).then(function() {
          return i2;
        });
      }, e2);
    }, Rt.prototype.offset = function(t2) {
      var e2 = this._ctx;
      return t2 <= 0 || (e2.offset += t2, St(e2) ? At(e2, function() {
        var n2 = t2;
        return function(e3, t3) {
          return 0 === n2 || (1 === n2 ? --n2 : t3(function() {
            e3.advance(n2), n2 = 0;
          }), false);
        };
      }) : At(e2, function() {
        var e3 = t2;
        return function() {
          return --e3 < 0;
        };
      })), this;
    }, Rt.prototype.limit = function(e2) {
      return this._ctx.limit = Math.min(this._ctx.limit, e2), At(this._ctx, function() {
        var r2 = e2;
        return function(e3, t2, n2) {
          return --r2 <= 0 && t2(n2), 0 <= r2;
        };
      }, true), this;
    }, Rt.prototype.until = function(r2, i2) {
      return jt(this._ctx, function(e2, t2, n2) {
        return !r2(e2.value) || (t2(n2), i2);
      }), this;
    }, Rt.prototype.first = function(e2) {
      return this.limit(1).toArray(function(e3) {
        return e3[0];
      }).then(e2);
    }, Rt.prototype.last = function(e2) {
      return this.reverse().first(e2);
    }, Rt.prototype.filter = function(t2) {
      var e2;
      return jt(this._ctx, function(e3) {
        return t2(e3.value);
      }), (e2 = this._ctx).isMatch = mt(e2.isMatch, t2), this;
    }, Rt.prototype.and = function(e2) {
      return this.filter(e2);
    }, Rt.prototype.or = function(e2) {
      return new this.db.WhereClause(this._ctx.table, e2, this);
    }, Rt.prototype.reverse = function() {
      return this._ctx.dir = "prev" === this._ctx.dir ? "next" : "prev", this._ondirectionchange && this._ondirectionchange(this._ctx.dir), this;
    }, Rt.prototype.desc = function() {
      return this.reverse();
    }, Rt.prototype.eachKey = function(n2) {
      var e2 = this._ctx;
      return e2.keysOnly = !e2.isMatch, this.each(function(e3, t2) {
        n2(t2.key, t2);
      });
    }, Rt.prototype.eachUniqueKey = function(e2) {
      return this._ctx.unique = "unique", this.eachKey(e2);
    }, Rt.prototype.eachPrimaryKey = function(n2) {
      var e2 = this._ctx;
      return e2.keysOnly = !e2.isMatch, this.each(function(e3, t2) {
        n2(t2.primaryKey, t2);
      });
    }, Rt.prototype.keys = function(e2) {
      var t2 = this._ctx;
      t2.keysOnly = !t2.isMatch;
      var n2 = [];
      return this.each(function(e3, t3) {
        n2.push(t3.key);
      }).then(function() {
        return n2;
      }).then(e2);
    }, Rt.prototype.primaryKeys = function(e2) {
      var n2 = this._ctx;
      if ("next" === n2.dir && St(n2, true) && 0 < n2.limit)
        return this._read(function(e3) {
          var t2 = Ct(n2, n2.table.core.schema);
          return n2.table.core.query({ trans: e3, values: false, limit: n2.limit, query: { index: t2, range: n2.range } });
        }).then(function(e3) {
          return e3.result;
        }).then(e2);
      n2.keysOnly = !n2.isMatch;
      var r2 = [];
      return this.each(function(e3, t2) {
        r2.push(t2.primaryKey);
      }).then(function() {
        return r2;
      }).then(e2);
    }, Rt.prototype.uniqueKeys = function(e2) {
      return this._ctx.unique = "unique", this.keys(e2);
    }, Rt.prototype.firstKey = function(e2) {
      return this.limit(1).keys(function(e3) {
        return e3[0];
      }).then(e2);
    }, Rt.prototype.lastKey = function(e2) {
      return this.reverse().firstKey(e2);
    }, Rt.prototype.distinct = function() {
      var e2 = this._ctx, e2 = e2.index && e2.table.schema.idxByName[e2.index];
      if (!e2 || !e2.multi)
        return this;
      var n2 = {};
      return jt(this._ctx, function(e3) {
        var t2 = e3.primaryKey.toString(), e3 = m(n2, t2);
        return n2[t2] = true, !e3;
      }), this;
    }, Rt.prototype.modify = function(w2) {
      var n2 = this, _2 = this._ctx;
      return this._write(function(d2) {
        var o2, a2, p2;
        p2 = "function" == typeof w2 ? w2 : (o2 = k(w2), a2 = o2.length, function(e3) {
          for (var t3 = false, n3 = 0; n3 < a2; ++n3) {
            var r2 = o2[n3], i2 = w2[r2];
            x(e3, r2) !== i2 && (O(e3, r2, i2), t3 = true);
          }
          return t3;
        });
        function y2(e3, t3) {
          var n3 = t3.failures, t3 = t3.numFailures;
          s2 += e3 - t3;
          for (var r2 = 0, i2 = k(n3); r2 < i2.length; r2++) {
            var o3 = i2[r2];
            u2.push(n3[o3]);
          }
        }
        var v2 = _2.table.core, e2 = v2.schema.primaryKey, m2 = e2.outbound, b2 = e2.extractKey, g2 = n2.db._options.modifyChunkSize || 200, u2 = [], s2 = 0, t2 = [];
        return n2.clone().primaryKeys().then(function(f2) {
          function h2(c2) {
            var l2 = Math.min(g2, f2.length - c2);
            return v2.getMany({ trans: d2, keys: f2.slice(c2, c2 + l2), cache: "immutable" }).then(function(e3) {
              for (var n3 = [], t3 = [], r2 = m2 ? [] : null, i2 = [], o3 = 0; o3 < l2; ++o3) {
                var a3 = e3[o3], u3 = { value: j(a3), primKey: f2[c2 + o3] };
                false !== p2.call(u3, u3.value, u3) && (null == u3.value ? i2.push(f2[c2 + o3]) : m2 || 0 === _t(b2(a3), b2(u3.value)) ? (t3.push(u3.value), m2 && r2.push(f2[c2 + o3])) : (i2.push(f2[c2 + o3]), n3.push(u3.value)));
              }
              var s3 = St(_2) && _2.limit === 1 / 0 && ("function" != typeof w2 || w2 === Bt) && { index: _2.index, range: _2.range };
              return Promise.resolve(0 < n3.length && v2.mutate({ trans: d2, type: "add", values: n3 }).then(function(e4) {
                for (var t4 in e4.failures)
                  i2.splice(parseInt(t4), 1);
                y2(n3.length, e4);
              })).then(function() {
                return (0 < t3.length || s3 && "object" == typeof w2) && v2.mutate({ trans: d2, type: "put", keys: r2, values: t3, criteria: s3, changeSpec: "function" != typeof w2 && w2 }).then(function(e4) {
                  return y2(t3.length, e4);
                });
              }).then(function() {
                return (0 < i2.length || s3 && w2 === Bt) && v2.mutate({ trans: d2, type: "delete", keys: i2, criteria: s3 }).then(function(e4) {
                  return y2(i2.length, e4);
                });
              }).then(function() {
                return f2.length > c2 + l2 && h2(c2 + g2);
              });
            });
          }
          return h2(0).then(function() {
            if (0 < u2.length)
              throw new H("Error modifying one or more objects", u2, s2, t2);
            return f2.length;
          });
        });
      });
    }, Rt.prototype.delete = function() {
      var i2 = this._ctx, n2 = i2.range;
      return St(i2) && (i2.isPrimKey && !dt || 3 === n2.type) ? this._write(function(e2) {
        var t2 = i2.table.core.schema.primaryKey, r2 = n2;
        return i2.table.core.count({ trans: e2, query: { index: t2, range: r2 } }).then(function(n3) {
          return i2.table.core.mutate({ trans: e2, type: "deleteRange", range: r2 }).then(function(e3) {
            var t3 = e3.failures;
            e3.lastResult, e3.results;
            e3 = e3.numFailures;
            if (e3)
              throw new H("Could not delete some values", Object.keys(t3).map(function(e4) {
                return t3[e4];
              }), n3 - e3);
            return n3 - e3;
          });
        });
      }) : this.modify(Bt);
    }, Rt);
    function Rt() {
    }
    var Bt = function(e2, t2) {
      return t2.value = null;
    };
    function Ft(e2, t2) {
      return e2 < t2 ? -1 : e2 === t2 ? 0 : 1;
    }
    function Mt(e2, t2) {
      return t2 < e2 ? -1 : e2 === t2 ? 0 : 1;
    }
    function Nt(e2, t2, n2) {
      e2 = e2 instanceof Wt ? new e2.Collection(e2) : e2;
      return e2._ctx.error = new (n2 || TypeError)(t2), e2;
    }
    function Lt(e2) {
      return new e2.Collection(e2, function() {
        return Vt("");
      }).limit(0);
    }
    function Ut(e2, s2, n2, r2) {
      var i2, c2, l2, f2, h2, d2, p2, y2 = n2.length;
      if (!n2.every(function(e3) {
        return "string" == typeof e3;
      }))
        return Nt(e2, ct);
      function t2(e3) {
        i2 = "next" === e3 ? function(e4) {
          return e4.toUpperCase();
        } : function(e4) {
          return e4.toLowerCase();
        }, c2 = "next" === e3 ? function(e4) {
          return e4.toLowerCase();
        } : function(e4) {
          return e4.toUpperCase();
        }, l2 = "next" === e3 ? Ft : Mt;
        var t3 = n2.map(function(e4) {
          return { lower: c2(e4), upper: i2(e4) };
        }).sort(function(e4, t4) {
          return l2(e4.lower, t4.lower);
        });
        f2 = t3.map(function(e4) {
          return e4.upper;
        }), h2 = t3.map(function(e4) {
          return e4.lower;
        }), p2 = "next" === (d2 = e3) ? "" : r2;
      }
      t2("next");
      e2 = new e2.Collection(e2, function() {
        return zt(f2[0], h2[y2 - 1] + r2);
      });
      e2._ondirectionchange = function(e3) {
        t2(e3);
      };
      var v2 = 0;
      return e2._addAlgorithm(function(e3, t3, n3) {
        var r3 = e3.key;
        if ("string" != typeof r3)
          return false;
        var i3 = c2(r3);
        if (s2(i3, h2, v2))
          return true;
        for (var o2 = null, a2 = v2; a2 < y2; ++a2) {
          var u2 = function(e4, t4, n4, r4, i4, o3) {
            for (var a3 = Math.min(e4.length, r4.length), u3 = -1, s3 = 0; s3 < a3; ++s3) {
              var c3 = t4[s3];
              if (c3 !== r4[s3])
                return i4(e4[s3], n4[s3]) < 0 ? e4.substr(0, s3) + n4[s3] + n4.substr(s3 + 1) : i4(e4[s3], r4[s3]) < 0 ? e4.substr(0, s3) + r4[s3] + n4.substr(s3 + 1) : 0 <= u3 ? e4.substr(0, u3) + t4[u3] + n4.substr(u3 + 1) : null;
              i4(e4[s3], c3) < 0 && (u3 = s3);
            }
            return a3 < r4.length && "next" === o3 ? e4 + n4.substr(e4.length) : a3 < e4.length && "prev" === o3 ? e4.substr(0, n4.length) : u3 < 0 ? null : e4.substr(0, u3) + r4[u3] + n4.substr(u3 + 1);
          }(r3, i3, f2[a2], h2[a2], l2, d2);
          null === u2 && null === o2 ? v2 = a2 + 1 : (null === o2 || 0 < l2(o2, u2)) && (o2 = u2);
        }
        return t3(null !== o2 ? function() {
          e3.continue(o2 + p2);
        } : n3), false;
      }), e2;
    }
    function zt(e2, t2, n2, r2) {
      return { type: 2, lower: e2, upper: t2, lowerOpen: n2, upperOpen: r2 };
    }
    function Vt(e2) {
      return { type: 1, lower: e2, upper: e2 };
    }
    var Wt = (Object.defineProperty(Yt.prototype, "Collection", { get: function() {
      return this._ctx.table.db.Collection;
    }, enumerable: false, configurable: true }), Yt.prototype.between = function(e2, t2, n2, r2) {
      n2 = false !== n2, r2 = true === r2;
      try {
        return 0 < this._cmp(e2, t2) || 0 === this._cmp(e2, t2) && (n2 || r2) && (!n2 || !r2) ? Lt(this) : new this.Collection(this, function() {
          return zt(e2, t2, !n2, !r2);
        });
      } catch (e3) {
        return Nt(this, st);
      }
    }, Yt.prototype.equals = function(e2) {
      return null == e2 ? Nt(this, st) : new this.Collection(this, function() {
        return Vt(e2);
      });
    }, Yt.prototype.above = function(e2) {
      return null == e2 ? Nt(this, st) : new this.Collection(this, function() {
        return zt(e2, void 0, true);
      });
    }, Yt.prototype.aboveOrEqual = function(e2) {
      return null == e2 ? Nt(this, st) : new this.Collection(this, function() {
        return zt(e2, void 0, false);
      });
    }, Yt.prototype.below = function(e2) {
      return null == e2 ? Nt(this, st) : new this.Collection(this, function() {
        return zt(void 0, e2, false, true);
      });
    }, Yt.prototype.belowOrEqual = function(e2) {
      return null == e2 ? Nt(this, st) : new this.Collection(this, function() {
        return zt(void 0, e2);
      });
    }, Yt.prototype.startsWith = function(e2) {
      return "string" != typeof e2 ? Nt(this, ct) : this.between(e2, e2 + ut, true, true);
    }, Yt.prototype.startsWithIgnoreCase = function(e2) {
      return "" === e2 ? this.startsWith(e2) : Ut(this, function(e3, t2) {
        return 0 === e3.indexOf(t2[0]);
      }, [e2], ut);
    }, Yt.prototype.equalsIgnoreCase = function(e2) {
      return Ut(this, function(e3, t2) {
        return e3 === t2[0];
      }, [e2], "");
    }, Yt.prototype.anyOfIgnoreCase = function() {
      var e2 = R.apply(I, arguments);
      return 0 === e2.length ? Lt(this) : Ut(this, function(e3, t2) {
        return -1 !== t2.indexOf(e3);
      }, e2, "");
    }, Yt.prototype.startsWithAnyOfIgnoreCase = function() {
      var e2 = R.apply(I, arguments);
      return 0 === e2.length ? Lt(this) : Ut(this, function(t2, e3) {
        return e3.some(function(e4) {
          return 0 === t2.indexOf(e4);
        });
      }, e2, ut);
    }, Yt.prototype.anyOf = function() {
      var t2 = this, i2 = R.apply(I, arguments), o2 = this._cmp;
      try {
        i2.sort(o2);
      } catch (e3) {
        return Nt(this, st);
      }
      if (0 === i2.length)
        return Lt(this);
      var e2 = new this.Collection(this, function() {
        return zt(i2[0], i2[i2.length - 1]);
      });
      e2._ondirectionchange = function(e3) {
        o2 = "next" === e3 ? t2._ascending : t2._descending, i2.sort(o2);
      };
      var a2 = 0;
      return e2._addAlgorithm(function(e3, t3, n2) {
        for (var r2 = e3.key; 0 < o2(r2, i2[a2]); )
          if (++a2 === i2.length)
            return t3(n2), false;
        return 0 === o2(r2, i2[a2]) || (t3(function() {
          e3.continue(i2[a2]);
        }), false);
      }), e2;
    }, Yt.prototype.notEqual = function(e2) {
      return this.inAnyRange([[-1 / 0, e2], [e2, this.db._maxKey]], { includeLowers: false, includeUppers: false });
    }, Yt.prototype.noneOf = function() {
      var e2 = R.apply(I, arguments);
      if (0 === e2.length)
        return new this.Collection(this);
      try {
        e2.sort(this._ascending);
      } catch (e3) {
        return Nt(this, st);
      }
      var t2 = e2.reduce(function(e3, t3) {
        return e3 ? e3.concat([[e3[e3.length - 1][1], t3]]) : [[-1 / 0, t3]];
      }, null);
      return t2.push([e2[e2.length - 1], this.db._maxKey]), this.inAnyRange(t2, { includeLowers: false, includeUppers: false });
    }, Yt.prototype.inAnyRange = function(e2, t2) {
      var o2 = this, a2 = this._cmp, u2 = this._ascending, n2 = this._descending, s2 = this._min, c2 = this._max;
      if (0 === e2.length)
        return Lt(this);
      if (!e2.every(function(e3) {
        return void 0 !== e3[0] && void 0 !== e3[1] && u2(e3[0], e3[1]) <= 0;
      }))
        return Nt(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", Z.InvalidArgument);
      var r2 = !t2 || false !== t2.includeLowers, i2 = t2 && true === t2.includeUppers;
      var l2, f2 = u2;
      function h2(e3, t3) {
        return f2(e3[0], t3[0]);
      }
      try {
        (l2 = e2.reduce(function(e3, t3) {
          for (var n3 = 0, r3 = e3.length; n3 < r3; ++n3) {
            var i3 = e3[n3];
            if (a2(t3[0], i3[1]) < 0 && 0 < a2(t3[1], i3[0])) {
              i3[0] = s2(i3[0], t3[0]), i3[1] = c2(i3[1], t3[1]);
              break;
            }
          }
          return n3 === r3 && e3.push(t3), e3;
        }, [])).sort(h2);
      } catch (e3) {
        return Nt(this, st);
      }
      var d2 = 0, p2 = i2 ? function(e3) {
        return 0 < u2(e3, l2[d2][1]);
      } : function(e3) {
        return 0 <= u2(e3, l2[d2][1]);
      }, y2 = r2 ? function(e3) {
        return 0 < n2(e3, l2[d2][0]);
      } : function(e3) {
        return 0 <= n2(e3, l2[d2][0]);
      };
      var v2 = p2, e2 = new this.Collection(this, function() {
        return zt(l2[0][0], l2[l2.length - 1][1], !r2, !i2);
      });
      return e2._ondirectionchange = function(e3) {
        f2 = "next" === e3 ? (v2 = p2, u2) : (v2 = y2, n2), l2.sort(h2);
      }, e2._addAlgorithm(function(e3, t3, n3) {
        for (var r3, i3 = e3.key; v2(i3); )
          if (++d2 === l2.length)
            return t3(n3), false;
        return !p2(r3 = i3) && !y2(r3) || (0 === o2._cmp(i3, l2[d2][1]) || 0 === o2._cmp(i3, l2[d2][0]) || t3(function() {
          f2 === u2 ? e3.continue(l2[d2][0]) : e3.continue(l2[d2][1]);
        }), false);
      }), e2;
    }, Yt.prototype.startsWithAnyOf = function() {
      var e2 = R.apply(I, arguments);
      return e2.every(function(e3) {
        return "string" == typeof e3;
      }) ? 0 === e2.length ? Lt(this) : this.inAnyRange(e2.map(function(e3) {
        return [e3, e3 + ut];
      })) : Nt(this, "startsWithAnyOf() only works with strings");
    }, Yt);
    function Yt() {
    }
    function Qt(t2) {
      return Ue(function(e2) {
        return Gt(e2), t2(e2.target.error), false;
      });
    }
    function Gt(e2) {
      e2.stopPropagation && e2.stopPropagation(), e2.preventDefault && e2.preventDefault();
    }
    var Ht = "storagemutated", Xt = "x-storagemutated-1", Jt = Et(null, Ht), $t = (Zt.prototype._lock = function() {
      return b(!Pe.global), ++this._reculock, 1 !== this._reculock || Pe.global || (Pe.lockOwnerFor = this), this;
    }, Zt.prototype._unlock = function() {
      if (b(!Pe.global), 0 == --this._reculock)
        for (Pe.global || (Pe.lockOwnerFor = null); 0 < this._blockedFuncs.length && !this._locked(); ) {
          var e2 = this._blockedFuncs.shift();
          try {
            nt(e2[1], e2[0]);
          } catch (e3) {
          }
        }
      return this;
    }, Zt.prototype._locked = function() {
      return this._reculock && Pe.lockOwnerFor !== this;
    }, Zt.prototype.create = function(t2) {
      var n2 = this;
      if (!this.mode)
        return this;
      var e2 = this.db.idbdb, r2 = this.db._state.dbOpenError;
      if (b(!this.idbtrans), !t2 && !e2)
        switch (r2 && r2.name) {
          case "DatabaseClosedError":
            throw new Z.DatabaseClosed(r2);
          case "MissingAPIError":
            throw new Z.MissingAPI(r2.message, r2);
          default:
            throw new Z.OpenFailed(r2);
        }
      if (!this.active)
        throw new Z.TransactionInactive();
      return b(null === this._completion._state), (t2 = this.idbtrans = t2 || (this.db.core || e2).transaction(this.storeNames, this.mode, { durability: this.chromeTransactionDurability })).onerror = Ue(function(e3) {
        Gt(e3), n2._reject(t2.error);
      }), t2.onabort = Ue(function(e3) {
        Gt(e3), n2.active && n2._reject(new Z.Abort(t2.error)), n2.active = false, n2.on("abort").fire(e3);
      }), t2.oncomplete = Ue(function() {
        n2.active = false, n2._resolve(), "mutatedParts" in t2 && Jt.storagemutated.fire(t2.mutatedParts);
      }), this;
    }, Zt.prototype._promise = function(n2, r2, i2) {
      var o2 = this;
      if ("readwrite" === n2 && "readwrite" !== this.mode)
        return ot(new Z.ReadOnly("Transaction is readonly"));
      if (!this.active)
        return ot(new Z.TransactionInactive());
      if (this._locked())
        return new je(function(e3, t2) {
          o2._blockedFuncs.push([function() {
            o2._promise(n2, r2, i2).then(e3, t2);
          }, Pe]);
        });
      if (i2)
        return He(function() {
          var e3 = new je(function(e4, t2) {
            o2._lock();
            var n3 = r2(e4, t2, o2);
            n3 && n3.then && n3.then(e4, t2);
          });
          return e3.finally(function() {
            return o2._unlock();
          }), e3._lib = true, e3;
        });
      var e2 = new je(function(e3, t2) {
        var n3 = r2(e3, t2, o2);
        n3 && n3.then && n3.then(e3, t2);
      });
      return e2._lib = true, e2;
    }, Zt.prototype._root = function() {
      return this.parent ? this.parent._root() : this;
    }, Zt.prototype.waitFor = function(e2) {
      var t2, r2 = this._root(), i2 = je.resolve(e2);
      r2._waitingFor ? r2._waitingFor = r2._waitingFor.then(function() {
        return i2;
      }) : (r2._waitingFor = i2, r2._waitingQueue = [], t2 = r2.idbtrans.objectStore(r2.storeNames[0]), function e3() {
        for (++r2._spinCount; r2._waitingQueue.length; )
          r2._waitingQueue.shift()();
        r2._waitingFor && (t2.get(-1 / 0).onsuccess = e3);
      }());
      var o2 = r2._waitingFor;
      return new je(function(t3, n2) {
        i2.then(function(e3) {
          return r2._waitingQueue.push(Ue(t3.bind(null, e3)));
        }, function(e3) {
          return r2._waitingQueue.push(Ue(n2.bind(null, e3)));
        }).finally(function() {
          r2._waitingFor === o2 && (r2._waitingFor = null);
        });
      });
    }, Zt.prototype.abort = function() {
      this.active && (this.active = false, this.idbtrans && this.idbtrans.abort(), this._reject(new Z.Abort()));
    }, Zt.prototype.table = function(e2) {
      var t2 = this._memoizedTables || (this._memoizedTables = {});
      if (m(t2, e2))
        return t2[e2];
      var n2 = this.schema[e2];
      if (!n2)
        throw new Z.NotFound("Table " + e2 + " not part of transaction");
      n2 = new this.db.Table(e2, n2, this);
      return n2.core = this.db.core.table(e2), t2[e2] = n2;
    }, Zt);
    function Zt() {
    }
    function en(e2, t2, n2, r2, i2, o2, a2) {
      return { name: e2, keyPath: t2, unique: n2, multi: r2, auto: i2, compound: o2, src: (n2 && !a2 ? "&" : "") + (r2 ? "*" : "") + (i2 ? "++" : "") + tn(t2) };
    }
    function tn(e2) {
      return "string" == typeof e2 ? e2 : e2 ? "[" + [].join.call(e2, "+") + "]" : "";
    }
    function nn(e2, t2, n2) {
      return { name: e2, primKey: t2, indexes: n2, mappedClass: null, idxByName: (r2 = function(e3) {
        return [e3.name, e3];
      }, n2.reduce(function(e3, t3, n3) {
        n3 = r2(t3, n3);
        return n3 && (e3[n3[0]] = n3[1]), e3;
      }, {})) };
      var r2;
    }
    var rn = function(e2) {
      try {
        return e2.only([[]]), rn = function() {
          return [[]];
        }, [[]];
      } catch (e3) {
        return rn = function() {
          return ut;
        }, ut;
      }
    };
    function on(t2) {
      return null == t2 ? function() {
      } : "string" == typeof t2 ? 1 === (n2 = t2).split(".").length ? function(e2) {
        return e2[n2];
      } : function(e2) {
        return x(e2, n2);
      } : function(e2) {
        return x(e2, t2);
      };
      var n2;
    }
    function an(e2) {
      return [].slice.call(e2);
    }
    var un = 0;
    function sn(e2) {
      return null == e2 ? ":id" : "string" == typeof e2 ? e2 : "[".concat(e2.join("+"), "]");
    }
    function cn(e2, i2, t2) {
      function _2(e3) {
        if (3 === e3.type)
          return null;
        if (4 === e3.type)
          throw new Error("Cannot convert never type to IDBKeyRange");
        var t3 = e3.lower, n3 = e3.upper, r3 = e3.lowerOpen, e3 = e3.upperOpen;
        return void 0 === t3 ? void 0 === n3 ? null : i2.upperBound(n3, !!e3) : void 0 === n3 ? i2.lowerBound(t3, !!r3) : i2.bound(t3, n3, !!r3, !!e3);
      }
      function n2(e3) {
        var h2, w2 = e3.name;
        return { name: w2, schema: e3, mutate: function(e4) {
          var y2 = e4.trans, v2 = e4.type, m2 = e4.keys, b2 = e4.values, g2 = e4.range;
          return new Promise(function(t3, e5) {
            t3 = Ue(t3);
            var n3 = y2.objectStore(w2), r3 = null == n3.keyPath, i3 = "put" === v2 || "add" === v2;
            if (!i3 && "delete" !== v2 && "deleteRange" !== v2)
              throw new Error("Invalid operation type: " + v2);
            var o3, a3 = (m2 || b2 || { length: 1 }).length;
            if (m2 && b2 && m2.length !== b2.length)
              throw new Error("Given keys array must have same length as given values array.");
            if (0 === a3)
              return t3({ numFailures: 0, failures: {}, results: [], lastResult: void 0 });
            function u3(e6) {
              ++l2, Gt(e6);
            }
            var s3 = [], c3 = [], l2 = 0;
            if ("deleteRange" === v2) {
              if (4 === g2.type)
                return t3({ numFailures: l2, failures: c3, results: [], lastResult: void 0 });
              3 === g2.type ? s3.push(o3 = n3.clear()) : s3.push(o3 = n3.delete(_2(g2)));
            } else {
              var r3 = i3 ? r3 ? [b2, m2] : [b2, null] : [m2, null], f2 = r3[0], h3 = r3[1];
              if (i3)
                for (var d2 = 0; d2 < a3; ++d2)
                  s3.push(o3 = h3 && void 0 !== h3[d2] ? n3[v2](f2[d2], h3[d2]) : n3[v2](f2[d2])), o3.onerror = u3;
              else
                for (d2 = 0; d2 < a3; ++d2)
                  s3.push(o3 = n3[v2](f2[d2])), o3.onerror = u3;
            }
            function p2(e6) {
              e6 = e6.target.result, s3.forEach(function(e7, t4) {
                return null != e7.error && (c3[t4] = e7.error);
              }), t3({ numFailures: l2, failures: c3, results: "delete" === v2 ? m2 : s3.map(function(e7) {
                return e7.result;
              }), lastResult: e6 });
            }
            o3.onerror = function(e6) {
              u3(e6), p2(e6);
            }, o3.onsuccess = p2;
          });
        }, getMany: function(e4) {
          var f2 = e4.trans, h3 = e4.keys;
          return new Promise(function(t3, e5) {
            t3 = Ue(t3);
            for (var n3, r3 = f2.objectStore(w2), i3 = h3.length, o3 = new Array(i3), a3 = 0, u3 = 0, s3 = function(e6) {
              e6 = e6.target;
              o3[e6._pos] = e6.result, ++u3 === a3 && t3(o3);
            }, c3 = Qt(e5), l2 = 0; l2 < i3; ++l2)
              null != h3[l2] && ((n3 = r3.get(h3[l2]))._pos = l2, n3.onsuccess = s3, n3.onerror = c3, ++a3);
            0 === a3 && t3(o3);
          });
        }, get: function(e4) {
          var r3 = e4.trans, i3 = e4.key;
          return new Promise(function(t3, e5) {
            t3 = Ue(t3);
            var n3 = r3.objectStore(w2).get(i3);
            n3.onsuccess = function(e6) {
              return t3(e6.target.result);
            }, n3.onerror = Qt(e5);
          });
        }, query: (h2 = s2, function(f2) {
          return new Promise(function(n3, e4) {
            n3 = Ue(n3);
            var r3, i3, o3, t3 = f2.trans, a3 = f2.values, u3 = f2.limit, s3 = f2.query, c3 = u3 === 1 / 0 ? void 0 : u3, l2 = s3.index, s3 = s3.range, t3 = t3.objectStore(w2), l2 = l2.isPrimaryKey ? t3 : t3.index(l2.name), s3 = _2(s3);
            if (0 === u3)
              return n3({ result: [] });
            h2 ? ((c3 = a3 ? l2.getAll(s3, c3) : l2.getAllKeys(s3, c3)).onsuccess = function(e5) {
              return n3({ result: e5.target.result });
            }, c3.onerror = Qt(e4)) : (r3 = 0, i3 = !a3 && "openKeyCursor" in l2 ? l2.openKeyCursor(s3) : l2.openCursor(s3), o3 = [], i3.onsuccess = function(e5) {
              var t4 = i3.result;
              return t4 ? (o3.push(a3 ? t4.value : t4.primaryKey), ++r3 === u3 ? n3({ result: o3 }) : void t4.continue()) : n3({ result: o3 });
            }, i3.onerror = Qt(e4));
          });
        }), openCursor: function(e4) {
          var c3 = e4.trans, o3 = e4.values, a3 = e4.query, u3 = e4.reverse, l2 = e4.unique;
          return new Promise(function(t3, n3) {
            t3 = Ue(t3);
            var e5 = a3.index, r3 = a3.range, i3 = c3.objectStore(w2), i3 = e5.isPrimaryKey ? i3 : i3.index(e5.name), e5 = u3 ? l2 ? "prevunique" : "prev" : l2 ? "nextunique" : "next", s3 = !o3 && "openKeyCursor" in i3 ? i3.openKeyCursor(_2(r3), e5) : i3.openCursor(_2(r3), e5);
            s3.onerror = Qt(n3), s3.onsuccess = Ue(function(e6) {
              var r4, i4, o4, a4, u4 = s3.result;
              u4 ? (u4.___id = ++un, u4.done = false, r4 = u4.continue.bind(u4), i4 = (i4 = u4.continuePrimaryKey) && i4.bind(u4), o4 = u4.advance.bind(u4), a4 = function() {
                throw new Error("Cursor not stopped");
              }, u4.trans = c3, u4.stop = u4.continue = u4.continuePrimaryKey = u4.advance = function() {
                throw new Error("Cursor not started");
              }, u4.fail = Ue(n3), u4.next = function() {
                var e7 = this, t4 = 1;
                return this.start(function() {
                  return t4-- ? e7.continue() : e7.stop();
                }).then(function() {
                  return e7;
                });
              }, u4.start = function(e7) {
                function t4() {
                  if (s3.result)
                    try {
                      e7();
                    } catch (e8) {
                      u4.fail(e8);
                    }
                  else
                    u4.done = true, u4.start = function() {
                      throw new Error("Cursor behind last entry");
                    }, u4.stop();
                }
                var n4 = new Promise(function(t5, e8) {
                  t5 = Ue(t5), s3.onerror = Qt(e8), u4.fail = e8, u4.stop = function(e9) {
                    u4.stop = u4.continue = u4.continuePrimaryKey = u4.advance = a4, t5(e9);
                  };
                });
                return s3.onsuccess = Ue(function(e8) {
                  s3.onsuccess = t4, t4();
                }), u4.continue = r4, u4.continuePrimaryKey = i4, u4.advance = o4, t4(), n4;
              }, t3(u4)) : t3(null);
            }, n3);
          });
        }, count: function(e4) {
          var t3 = e4.query, i3 = e4.trans, o3 = t3.index, a3 = t3.range;
          return new Promise(function(t4, e5) {
            var n3 = i3.objectStore(w2), r3 = o3.isPrimaryKey ? n3 : n3.index(o3.name), n3 = _2(a3), r3 = n3 ? r3.count(n3) : r3.count();
            r3.onsuccess = Ue(function(e6) {
              return t4(e6.target.result);
            }), r3.onerror = Qt(e5);
          });
        } };
      }
      var r2, o2, a2, u2 = (o2 = t2, a2 = an((r2 = e2).objectStoreNames), { schema: { name: r2.name, tables: a2.map(function(e3) {
        return o2.objectStore(e3);
      }).map(function(t3) {
        var e3 = t3.keyPath, n3 = t3.autoIncrement, r3 = g(e3), i3 = {}, n3 = { name: t3.name, primaryKey: { name: null, isPrimaryKey: true, outbound: null == e3, compound: r3, keyPath: e3, autoIncrement: n3, unique: true, extractKey: on(e3) }, indexes: an(t3.indexNames).map(function(e4) {
          return t3.index(e4);
        }).map(function(e4) {
          var t4 = e4.name, n4 = e4.unique, r4 = e4.multiEntry, e4 = e4.keyPath, r4 = { name: t4, compound: g(e4), keyPath: e4, unique: n4, multiEntry: r4, extractKey: on(e4) };
          return i3[sn(e4)] = r4;
        }), getIndexByKeyPath: function(e4) {
          return i3[sn(e4)];
        } };
        return i3[":id"] = n3.primaryKey, null != e3 && (i3[sn(e3)] = n3.primaryKey), n3;
      }) }, hasGetAll: 0 < a2.length && "getAll" in o2.objectStore(a2[0]) && !("undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) }), t2 = u2.schema, s2 = u2.hasGetAll, u2 = t2.tables.map(n2), c2 = {};
      return u2.forEach(function(e3) {
        return c2[e3.name] = e3;
      }), { stack: "dbcore", transaction: e2.transaction.bind(e2), table: function(e3) {
        if (!c2[e3])
          throw new Error("Table '".concat(e3, "' not found"));
        return c2[e3];
      }, MIN_KEY: -1 / 0, MAX_KEY: rn(i2), schema: t2 };
    }
    function ln(e2, t2, n2, r2) {
      var i2 = n2.IDBKeyRange;
      return n2.indexedDB, { dbcore: (r2 = cn(t2, i2, r2), e2.dbcore.reduce(function(e3, t3) {
        t3 = t3.create;
        return _(_({}, e3), t3(e3));
      }, r2)) };
    }
    function fn(n2, e2) {
      var t2 = e2.db, e2 = ln(n2._middlewares, t2, n2._deps, e2);
      n2.core = e2.dbcore, n2.tables.forEach(function(e3) {
        var t3 = e3.name;
        n2.core.schema.tables.some(function(e4) {
          return e4.name === t3;
        }) && (e3.core = n2.core.table(t3), n2[t3] instanceof n2.Table && (n2[t3].core = e3.core));
      });
    }
    function hn(i2, e2, t2, o2) {
      t2.forEach(function(n2) {
        var r2 = o2[n2];
        e2.forEach(function(e3) {
          var t3 = d(e3, n2);
          (!t3 || "value" in t3 && void 0 === t3.value) && (e3 === i2.Transaction.prototype || e3 instanceof i2.Transaction ? l(e3, n2, { get: function() {
            return this.table(n2);
          }, set: function(e4) {
            u(this, n2, { value: e4, writable: true, configurable: true, enumerable: true });
          } }) : e3[n2] = new i2.Table(n2, r2));
        });
      });
    }
    function dn(n2, e2) {
      e2.forEach(function(e3) {
        for (var t2 in e3)
          e3[t2] instanceof n2.Table && delete e3[t2];
      });
    }
    function pn(e2, t2) {
      return e2._cfg.version - t2._cfg.version;
    }
    function yn(n2, r2, i2, e2) {
      var o2 = n2._dbSchema, a2 = n2._createTransaction("readwrite", n2._storeNames, o2);
      a2.create(i2), a2._completion.catch(e2);
      var u2 = a2._reject.bind(a2), p2 = Pe.transless || Pe;
      He(function() {
        var s2, c2, l2, f2, t2, e3, h2, d2;
        Pe.trans = a2, Pe.transless = p2, 0 === r2 ? (k(o2).forEach(function(e4) {
          mn(i2, e4, o2[e4].primKey, o2[e4].indexes);
        }), fn(n2, i2), je.follow(function() {
          return n2.on.populate.fire(a2);
        }).catch(u2)) : (c2 = r2, l2 = a2, f2 = i2, t2 = [], e3 = (s2 = n2)._versions, h2 = s2._dbSchema = gn(0, s2.idbdb, f2), d2 = false, e3.filter(function(e4) {
          return e4._cfg.version >= c2;
        }).forEach(function(u3) {
          t2.push(function() {
            var t3 = h2, e4 = u3._cfg.dbschema;
            wn(s2, t3, f2), wn(s2, e4, f2), h2 = s2._dbSchema = e4;
            var n3 = vn(t3, e4);
            n3.add.forEach(function(e5) {
              mn(f2, e5[0], e5[1].primKey, e5[1].indexes);
            }), n3.change.forEach(function(e5) {
              if (e5.recreate)
                throw new Z.Upgrade("Not yet support for changing primary key");
              var t4 = f2.objectStore(e5.name);
              e5.add.forEach(function(e6) {
                return bn(t4, e6);
              }), e5.change.forEach(function(e6) {
                t4.deleteIndex(e6.name), bn(t4, e6);
              }), e5.del.forEach(function(e6) {
                return t4.deleteIndex(e6);
              });
            });
            var r3 = u3._cfg.contentUpgrade;
            if (r3 && u3._cfg.version > c2) {
              fn(s2, f2), l2._memoizedTables = {}, d2 = true;
              var i3 = P(e4);
              n3.del.forEach(function(e5) {
                i3[e5] = t3[e5];
              }), dn(s2, [s2.Transaction.prototype]), hn(s2, [s2.Transaction.prototype], k(i3), i3), l2.schema = i3;
              var o3, a3 = B(r3);
              a3 && Xe();
              n3 = je.follow(function() {
                var e5;
                (o3 = r3(l2)) && a3 && (e5 = Je.bind(null, null), o3.then(e5, e5));
              });
              return o3 && "function" == typeof o3.then ? je.resolve(o3) : n3.then(function() {
                return o3;
              });
            }
          }), t2.push(function(e4) {
            var t3, n3, r3;
            d2 && ht || (t3 = u3._cfg.dbschema, n3 = t3, r3 = e4, [].slice.call(r3.db.objectStoreNames).forEach(function(e5) {
              return null == n3[e5] && r3.db.deleteObjectStore(e5);
            })), dn(s2, [s2.Transaction.prototype]), hn(s2, [s2.Transaction.prototype], s2._storeNames, s2._dbSchema), l2.schema = s2._dbSchema;
          });
        }), function e4() {
          return t2.length ? je.resolve(t2.shift()(l2.idbtrans)).then(e4) : je.resolve();
        }().then(function() {
          var t3, n3;
          n3 = f2, k(t3 = h2).forEach(function(e4) {
            n3.db.objectStoreNames.contains(e4) || mn(n3, e4, t3[e4].primKey, t3[e4].indexes);
          });
        }).catch(u2));
      });
    }
    function vn(e2, t2) {
      var n2, r2 = { del: [], add: [], change: [] };
      for (n2 in e2)
        t2[n2] || r2.del.push(n2);
      for (n2 in t2) {
        var i2 = e2[n2], o2 = t2[n2];
        if (i2) {
          var a2 = { name: n2, def: o2, recreate: false, del: [], add: [], change: [] };
          if ("" + (i2.primKey.keyPath || "") != "" + (o2.primKey.keyPath || "") || i2.primKey.auto !== o2.primKey.auto && !ft)
            a2.recreate = true, r2.change.push(a2);
          else {
            var u2 = i2.idxByName, s2 = o2.idxByName, c2 = void 0;
            for (c2 in u2)
              s2[c2] || a2.del.push(c2);
            for (c2 in s2) {
              var l2 = u2[c2], f2 = s2[c2];
              l2 ? l2.src !== f2.src && a2.change.push(f2) : a2.add.push(f2);
            }
            (0 < a2.del.length || 0 < a2.add.length || 0 < a2.change.length) && r2.change.push(a2);
          }
        } else
          r2.add.push([n2, o2]);
      }
      return r2;
    }
    function mn(e2, t2, n2, r2) {
      var i2 = e2.db.createObjectStore(t2, n2.keyPath ? { keyPath: n2.keyPath, autoIncrement: n2.auto } : { autoIncrement: n2.auto });
      return r2.forEach(function(e3) {
        return bn(i2, e3);
      }), i2;
    }
    function bn(e2, t2) {
      e2.createIndex(t2.name, t2.keyPath, { unique: t2.unique, multiEntry: t2.multi });
    }
    function gn(e2, t2, u2) {
      var s2 = {};
      return y(t2.objectStoreNames, 0).forEach(function(e3) {
        for (var t3 = u2.objectStore(e3), n2 = en(tn(a2 = t3.keyPath), a2 || "", false, false, !!t3.autoIncrement, a2 && "string" != typeof a2, true), r2 = [], i2 = 0; i2 < t3.indexNames.length; ++i2) {
          var o2 = t3.index(t3.indexNames[i2]), a2 = o2.keyPath, o2 = en(o2.name, a2, !!o2.unique, !!o2.multiEntry, false, a2 && "string" != typeof a2, false);
          r2.push(o2);
        }
        s2[e3] = nn(e3, n2, r2);
      }), s2;
    }
    function wn(e2, t2, n2) {
      for (var r2 = n2.db.objectStoreNames, i2 = 0; i2 < r2.length; ++i2) {
        var o2 = r2[i2], a2 = n2.objectStore(o2);
        e2._hasGetAll = "getAll" in a2;
        for (var u2 = 0; u2 < a2.indexNames.length; ++u2) {
          var s2 = a2.indexNames[u2], c2 = a2.index(s2).keyPath, l2 = "string" == typeof c2 ? c2 : "[" + y(c2).join("+") + "]";
          !t2[o2] || (c2 = t2[o2].idxByName[l2]) && (c2.name = s2, delete t2[o2].idxByName[l2], t2[o2].idxByName[s2] = c2);
        }
      }
      "undefined" != typeof navigator && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && f.WorkerGlobalScope && f instanceof f.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604 && (e2._hasGetAll = false);
    }
    var _n = (kn.prototype._parseStoresSpec = function(r2, i2) {
      k(r2).forEach(function(e2) {
        if (null !== r2[e2]) {
          var t2 = r2[e2].split(",").map(function(e3, t3) {
            var n3 = (e3 = e3.trim()).replace(/([&*]|\+\+)/g, ""), r3 = /^\[/.test(n3) ? n3.match(/^\[(.*)\]$/)[1].split("+") : n3;
            return en(n3, r3 || null, /\&/.test(e3), /\*/.test(e3), /\+\+/.test(e3), g(r3), 0 === t3);
          }), n2 = t2.shift();
          if (n2.multi)
            throw new Z.Schema("Primary key cannot be multi-valued");
          t2.forEach(function(e3) {
            if (e3.auto)
              throw new Z.Schema("Only primary key can be marked as autoIncrement (++)");
            if (!e3.keyPath)
              throw new Z.Schema("Index must have a name and cannot be an empty string");
          }), i2[e2] = nn(e2, n2, t2);
        }
      });
    }, kn.prototype.stores = function(e2) {
      var t2 = this.db;
      this._cfg.storesSource = this._cfg.storesSource ? a(this._cfg.storesSource, e2) : e2;
      var e2 = t2._versions, n2 = {}, r2 = {};
      return e2.forEach(function(e3) {
        a(n2, e3._cfg.storesSource), r2 = e3._cfg.dbschema = {}, e3._parseStoresSpec(n2, r2);
      }), t2._dbSchema = r2, dn(t2, [t2._allTables, t2, t2.Transaction.prototype]), hn(t2, [t2._allTables, t2, t2.Transaction.prototype, this._cfg.tables], k(r2), r2), t2._storeNames = k(r2), this;
    }, kn.prototype.upgrade = function(e2) {
      return this._cfg.contentUpgrade = le(this._cfg.contentUpgrade || ne, e2), this;
    }, kn);
    function kn() {
    }
    function xn(e2, t2) {
      var n2 = e2._dbNamesDB;
      return n2 || (n2 = e2._dbNamesDB = new ur(pt, { addons: [], indexedDB: e2, IDBKeyRange: t2 })).version(1).stores({ dbnames: "name" }), n2.table("dbnames");
    }
    function On(e2) {
      return e2 && "function" == typeof e2.databases;
    }
    function Pn(e2) {
      return He(function() {
        return Pe.letThrough = true, e2();
      });
    }
    function En(e2) {
      return !("from" in e2);
    }
    var Kn = function(e2, t2) {
      if (!this) {
        var n2 = new Kn();
        return e2 && "d" in e2 && a(n2, e2), n2;
      }
      a(this, arguments.length ? { d: 1, from: e2, to: 1 < arguments.length ? t2 : e2 } : { d: 0 });
    };
    function Sn(e2, t2, n2) {
      var r2 = _t(t2, n2);
      if (!isNaN(r2)) {
        if (0 < r2)
          throw RangeError();
        if (En(e2))
          return a(e2, { from: t2, to: n2, d: 1 });
        var i2 = e2.l, r2 = e2.r;
        if (_t(n2, e2.from) < 0)
          return i2 ? Sn(i2, t2, n2) : e2.l = { from: t2, to: n2, d: 1, l: null, r: null }, qn(e2);
        if (0 < _t(t2, e2.to))
          return r2 ? Sn(r2, t2, n2) : e2.r = { from: t2, to: n2, d: 1, l: null, r: null }, qn(e2);
        _t(t2, e2.from) < 0 && (e2.from = t2, e2.l = null, e2.d = r2 ? r2.d + 1 : 1), 0 < _t(n2, e2.to) && (e2.to = n2, e2.r = null, e2.d = e2.l ? e2.l.d + 1 : 1);
        n2 = !e2.r;
        i2 && !e2.l && jn(e2, i2), r2 && n2 && jn(e2, r2);
      }
    }
    function jn(e2, t2) {
      En(t2) || function e3(t3, n2) {
        var r2 = n2.from, i2 = n2.to, o2 = n2.l, n2 = n2.r;
        Sn(t3, r2, i2), o2 && e3(t3, o2), n2 && e3(t3, n2);
      }(e2, t2);
    }
    function An(e2, t2) {
      var n2 = Cn(t2), r2 = n2.next();
      if (r2.done)
        return false;
      for (var i2 = r2.value, o2 = Cn(e2), a2 = o2.next(i2.from), u2 = a2.value; !r2.done && !a2.done; ) {
        if (_t(u2.from, i2.to) <= 0 && 0 <= _t(u2.to, i2.from))
          return true;
        _t(i2.from, u2.from) < 0 ? i2 = (r2 = n2.next(u2.from)).value : u2 = (a2 = o2.next(i2.from)).value;
      }
      return false;
    }
    function Cn(e2) {
      var n2 = En(e2) ? null : { s: 0, n: e2 };
      return { next: function(e3) {
        for (var t2 = 0 < arguments.length; n2; )
          switch (n2.s) {
            case 0:
              if (n2.s = 1, t2)
                for (; n2.n.l && _t(e3, n2.n.from) < 0; )
                  n2 = { up: n2, n: n2.n.l, s: 1 };
              else
                for (; n2.n.l; )
                  n2 = { up: n2, n: n2.n.l, s: 1 };
            case 1:
              if (n2.s = 2, !t2 || _t(e3, n2.n.to) <= 0)
                return { value: n2.n, done: false };
            case 2:
              if (n2.n.r) {
                n2.s = 3, n2 = { up: n2, n: n2.n.r, s: 0 };
                continue;
              }
            case 3:
              n2 = n2.up;
          }
        return { done: true };
      } };
    }
    function qn(e2) {
      var t2, n2, r2 = ((null === (t2 = e2.r) || void 0 === t2 ? void 0 : t2.d) || 0) - ((null === (n2 = e2.l) || void 0 === n2 ? void 0 : n2.d) || 0), i2 = 1 < r2 ? "r" : r2 < -1 ? "l" : "";
      i2 && (t2 = "r" == i2 ? "l" : "r", n2 = _({}, e2), r2 = e2[i2], e2.from = r2.from, e2.to = r2.to, e2[i2] = r2[i2], n2[i2] = r2[t2], (e2[t2] = n2).d = Dn(n2)), e2.d = Dn(e2);
    }
    function Dn(e2) {
      var t2 = e2.r, e2 = e2.l;
      return (t2 ? e2 ? Math.max(t2.d, e2.d) : t2.d : e2 ? e2.d : 0) + 1;
    }
    function Tn(t2, n2) {
      return k(n2).forEach(function(e2) {
        t2[e2] ? jn(t2[e2], n2[e2]) : t2[e2] = function e3(t3) {
          var n3, r2, i2 = {};
          for (n3 in t3)
            m(t3, n3) && (r2 = t3[n3], i2[n3] = !r2 || "object" != typeof r2 || K.has(r2.constructor) ? r2 : e3(r2));
          return i2;
        }(n2[e2]);
      }), t2;
    }
    function In(t2, n2) {
      return Object.keys(t2).some(function(e2) {
        return n2[e2] && An(n2[e2], t2[e2]);
      });
    }
    r(Kn.prototype, ((W = { add: function(e2) {
      return jn(this, e2), this;
    }, addKey: function(e2) {
      return Sn(this, e2, e2), this;
    }, addKeys: function(e2) {
      var t2 = this;
      return e2.forEach(function(e3) {
        return Sn(t2, e3, e3);
      }), this;
    } })[q] = function() {
      return Cn(this);
    }, W));
    var Rn = {}, Bn = {}, Fn = false;
    function Mn(e2) {
      Tn(Bn, e2), Fn || (Fn = true, setTimeout(function() {
        Fn = false;
        var e3 = Bn;
        Bn = {}, Nn(e3);
      }, 0));
    }
    function Nn(e2, t2) {
      void 0 === t2 && (t2 = false);
      var n2, r2 = /* @__PURE__ */ new Set();
      for (n2 in e2) {
        var i2, o2 = /^idb\:\/\/(.*)\/(.*)\//.exec(n2);
        o2 && (i2 = o2[1], o2 = o2[2], (o2 = Rn["idb://".concat(i2, "/").concat(o2)]) && function(e3, t3, n3, r3) {
          for (var i3 = r3 && [], o3 = 0, a2 = Object.entries(e3.queries.query); o3 < a2.length; o3++) {
            for (var u2 = a2[o3], s2 = u2[0], u2 = u2[1], c2 = r3 && [], l2 = 0, f2 = u2; l2 < f2.length; l2++) {
              var h2 = f2[l2];
              h2.obsSet && In(t3, h2.obsSet) ? h2.subscribers.forEach(function(e4) {
                return n3.add(e4);
              }) : r3 && c2.push(h2);
            }
            r3 && i3.push([s2, c2]);
          }
          if (r3)
            for (var d2 = 0, p2 = i3; d2 < p2.length; d2++) {
              var y2 = p2[d2], s2 = y2[0], c2 = y2[1];
              e3.queries.query[s2] = c2;
            }
        }(o2, e2, r2, t2));
      }
      r2.forEach(function(e3) {
        return e3();
      });
    }
    function Ln(f2) {
      var h2 = f2._state, r2 = f2._deps.indexedDB;
      if (h2.isBeingOpened || f2.idbdb)
        return h2.dbReadyPromise.then(function() {
          return h2.dbOpenError ? ot(h2.dbOpenError) : f2;
        });
      F && (h2.openCanceller._stackHolder = U()), h2.isBeingOpened = true, h2.dbOpenError = null, h2.openComplete = false;
      var t2 = h2.openCanceller;
      function e2() {
        if (h2.openCanceller !== t2)
          throw new Z.DatabaseClosed("db.open() was cancelled");
      }
      function n2() {
        return new je(function(s2, n3) {
          if (e2(), !r2)
            throw new Z.MissingAPI();
          var c2 = f2.name, l2 = h2.autoSchema ? r2.open(c2) : r2.open(c2, Math.round(10 * f2.verno));
          if (!l2)
            throw new Z.MissingAPI();
          l2.onerror = Qt(n3), l2.onblocked = Ue(f2._fireOnBlocked), l2.onupgradeneeded = Ue(function(e3) {
            var t3;
            d2 = l2.transaction, h2.autoSchema && !f2._options.allowEmptyDB ? (l2.onerror = Gt, d2.abort(), l2.result.close(), (t3 = r2.deleteDatabase(c2)).onsuccess = t3.onerror = Ue(function() {
              n3(new Z.NoSuchDatabase("Database ".concat(c2, " doesnt exist")));
            })) : (d2.onerror = Qt(n3), e3 = e3.oldVersion > Math.pow(2, 62) ? 0 : e3.oldVersion, p2 = e3 < 1, f2.idbdb = l2.result, yn(f2, e3 / 10, d2, n3));
          }, n3), l2.onsuccess = Ue(function() {
            d2 = null;
            var e3, t3, n4, r3, i3, o3 = f2.idbdb = l2.result, a2 = y(o3.objectStoreNames);
            if (0 < a2.length)
              try {
                var u2 = o3.transaction(1 === (r3 = a2).length ? r3[0] : r3, "readonly");
                h2.autoSchema ? (t3 = o3, n4 = u2, (e3 = f2).verno = t3.version / 10, n4 = e3._dbSchema = gn(0, t3, n4), e3._storeNames = y(t3.objectStoreNames, 0), hn(e3, [e3._allTables], k(n4), n4)) : (wn(f2, f2._dbSchema, u2), ((i3 = vn(gn(0, (i3 = f2).idbdb, u2), i3._dbSchema)).add.length || i3.change.some(function(e4) {
                  return e4.add.length || e4.change.length;
                })) && console.warn("Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.")), fn(f2, u2);
              } catch (e4) {
              }
            lt.push(f2), o3.onversionchange = Ue(function(e4) {
              h2.vcFired = true, f2.on("versionchange").fire(e4);
            }), o3.onclose = Ue(function(e4) {
              f2.on("close").fire(e4);
            }), p2 && (i3 = f2._deps, u2 = c2, o3 = i3.indexedDB, i3 = i3.IDBKeyRange, On(o3) || u2 === pt || xn(o3, i3).put({ name: u2 }).catch(ne)), s2();
          }, n3);
        }).catch(function(e3) {
          return e3 && "UnknownError" === e3.name && 0 < h2.PR1398_maxLoop ? (h2.PR1398_maxLoop--, console.warn("Dexie: Workaround for Chrome UnknownError on open()"), n2()) : je.reject(e3);
        });
      }
      var i2, o2 = h2.dbReadyResolve, d2 = null, p2 = false;
      return je.race([t2, ("undefined" == typeof navigator ? je.resolve() : !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent) && indexedDB.databases ? new Promise(function(e3) {
        function t3() {
          return indexedDB.databases().finally(e3);
        }
        i2 = setInterval(t3, 100), t3();
      }).finally(function() {
        return clearInterval(i2);
      }) : Promise.resolve()).then(n2)]).then(function() {
        return e2(), h2.onReadyBeingFired = [], je.resolve(Pn(function() {
          return f2.on.ready.fire(f2.vip);
        })).then(function e3() {
          if (0 < h2.onReadyBeingFired.length) {
            var t3 = h2.onReadyBeingFired.reduce(le, ne);
            return h2.onReadyBeingFired = [], je.resolve(Pn(function() {
              return t3(f2.vip);
            })).then(e3);
          }
        });
      }).finally(function() {
        h2.openCanceller === t2 && (h2.onReadyBeingFired = null, h2.isBeingOpened = false);
      }).catch(function(e3) {
        h2.dbOpenError = e3;
        try {
          d2 && d2.abort();
        } catch (e4) {
        }
        return t2 === h2.openCanceller && f2._close(), ot(e3);
      }).finally(function() {
        h2.openComplete = true, o2();
      }).then(function() {
        var n3;
        return p2 && (n3 = {}, f2.tables.forEach(function(t3) {
          t3.schema.indexes.forEach(function(e3) {
            e3.name && (n3["idb://".concat(f2.name, "/").concat(t3.name, "/").concat(e3.name)] = new Kn(-1 / 0, [[[]]]));
          }), n3["idb://".concat(f2.name, "/").concat(t3.name, "/")] = n3["idb://".concat(f2.name, "/").concat(t3.name, "/:dels")] = new Kn(-1 / 0, [[[]]]);
        }), Jt(Ht).fire(n3), Nn(n3, true)), f2;
      });
    }
    function Un(t2) {
      function e2(e3) {
        return t2.next(e3);
      }
      var r2 = n2(e2), i2 = n2(function(e3) {
        return t2.throw(e3);
      });
      function n2(n3) {
        return function(e3) {
          var t3 = n3(e3), e3 = t3.value;
          return t3.done ? e3 : e3 && "function" == typeof e3.then ? e3.then(r2, i2) : g(e3) ? Promise.all(e3).then(r2, i2) : r2(e3);
        };
      }
      return n2(e2)();
    }
    function zn(e2, t2, n2) {
      for (var r2 = g(e2) ? e2.slice() : [e2], i2 = 0; i2 < n2; ++i2)
        r2.push(t2);
      return r2;
    }
    var Vn = { stack: "dbcore", name: "VirtualIndexMiddleware", level: 1, create: function(f2) {
      return _(_({}, f2), { table: function(e2) {
        var a2 = f2.table(e2), t2 = a2.schema, u2 = {}, s2 = [];
        function c2(e3, t3, n3) {
          var r3 = sn(e3), i3 = u2[r3] = u2[r3] || [], o2 = null == e3 ? 0 : "string" == typeof e3 ? 1 : e3.length, a3 = 0 < t3, a3 = _(_({}, n3), { name: a3 ? "".concat(r3, "(virtual-from:").concat(n3.name, ")") : n3.name, lowLevelIndex: n3, isVirtual: a3, keyTail: t3, keyLength: o2, extractKey: on(e3), unique: !a3 && n3.unique });
          return i3.push(a3), a3.isPrimaryKey || s2.push(a3), 1 < o2 && c2(2 === o2 ? e3[0] : e3.slice(0, o2 - 1), t3 + 1, n3), i3.sort(function(e4, t4) {
            return e4.keyTail - t4.keyTail;
          }), a3;
        }
        e2 = c2(t2.primaryKey.keyPath, 0, t2.primaryKey);
        u2[":id"] = [e2];
        for (var n2 = 0, r2 = t2.indexes; n2 < r2.length; n2++) {
          var i2 = r2[n2];
          c2(i2.keyPath, 0, i2);
        }
        function l2(e3) {
          var t3, n3 = e3.query.index;
          return n3.isVirtual ? _(_({}, e3), { query: { index: n3.lowLevelIndex, range: (t3 = e3.query.range, n3 = n3.keyTail, { type: 1 === t3.type ? 2 : t3.type, lower: zn(t3.lower, t3.lowerOpen ? f2.MAX_KEY : f2.MIN_KEY, n3), lowerOpen: true, upper: zn(t3.upper, t3.upperOpen ? f2.MIN_KEY : f2.MAX_KEY, n3), upperOpen: true }) } }) : e3;
        }
        return _(_({}, a2), { schema: _(_({}, t2), { primaryKey: e2, indexes: s2, getIndexByKeyPath: function(e3) {
          return (e3 = u2[sn(e3)]) && e3[0];
        } }), count: function(e3) {
          return a2.count(l2(e3));
        }, query: function(e3) {
          return a2.query(l2(e3));
        }, openCursor: function(t3) {
          var e3 = t3.query.index, r3 = e3.keyTail, n3 = e3.isVirtual, i3 = e3.keyLength;
          return n3 ? a2.openCursor(l2(t3)).then(function(e4) {
            return e4 && o2(e4);
          }) : a2.openCursor(t3);
          function o2(n4) {
            return Object.create(n4, { continue: { value: function(e4) {
              null != e4 ? n4.continue(zn(e4, t3.reverse ? f2.MAX_KEY : f2.MIN_KEY, r3)) : t3.unique ? n4.continue(n4.key.slice(0, i3).concat(t3.reverse ? f2.MIN_KEY : f2.MAX_KEY, r3)) : n4.continue();
            } }, continuePrimaryKey: { value: function(e4, t4) {
              n4.continuePrimaryKey(zn(e4, f2.MAX_KEY, r3), t4);
            } }, primaryKey: { get: function() {
              return n4.primaryKey;
            } }, key: { get: function() {
              var e4 = n4.key;
              return 1 === i3 ? e4[0] : e4.slice(0, i3);
            } }, value: { get: function() {
              return n4.value;
            } } });
          }
        } });
      } });
    } };
    function Wn(i2, o2, a2, u2) {
      return a2 = a2 || {}, u2 = u2 || "", k(i2).forEach(function(e2) {
        var t2, n2, r2;
        m(o2, e2) ? (t2 = i2[e2], n2 = o2[e2], "object" == typeof t2 && "object" == typeof n2 && t2 && n2 ? (r2 = C(t2)) !== C(n2) ? a2[u2 + e2] = o2[e2] : "Object" === r2 ? Wn(t2, n2, a2, u2 + e2 + ".") : t2 !== n2 && (a2[u2 + e2] = o2[e2]) : t2 !== n2 && (a2[u2 + e2] = o2[e2])) : a2[u2 + e2] = void 0;
      }), k(o2).forEach(function(e2) {
        m(i2, e2) || (a2[u2 + e2] = o2[e2]);
      }), a2;
    }
    function Yn(e2, t2) {
      return "delete" === t2.type ? t2.keys : t2.keys || t2.values.map(e2.extractKey);
    }
    var Qn = { stack: "dbcore", name: "HooksMiddleware", level: 2, create: function(e2) {
      return _(_({}, e2), { table: function(r2) {
        var y2 = e2.table(r2), v2 = y2.schema.primaryKey;
        return _(_({}, y2), { mutate: function(e3) {
          var t2 = Pe.trans, n2 = t2.table(r2).hook, h2 = n2.deleting, d2 = n2.creating, p2 = n2.updating;
          switch (e3.type) {
            case "add":
              if (d2.fire === ne)
                break;
              return t2._promise("readwrite", function() {
                return a2(e3);
              }, true);
            case "put":
              if (d2.fire === ne && p2.fire === ne)
                break;
              return t2._promise("readwrite", function() {
                return a2(e3);
              }, true);
            case "delete":
              if (h2.fire === ne)
                break;
              return t2._promise("readwrite", function() {
                return a2(e3);
              }, true);
            case "deleteRange":
              if (h2.fire === ne)
                break;
              return t2._promise("readwrite", function() {
                return function n3(r3, i2, o2) {
                  return y2.query({ trans: r3, values: false, query: { index: v2, range: i2 }, limit: o2 }).then(function(e4) {
                    var t3 = e4.result;
                    return a2({ type: "delete", keys: t3, trans: r3 }).then(function(e5) {
                      return 0 < e5.numFailures ? Promise.reject(e5.failures[0]) : t3.length < o2 ? { failures: [], numFailures: 0, lastResult: void 0 } : n3(r3, _(_({}, i2), { lower: t3[t3.length - 1], lowerOpen: true }), o2);
                    });
                  });
                }(e3.trans, e3.range, 1e4);
              }, true);
          }
          return y2.mutate(e3);
          function a2(c2) {
            var e4, t3, n3, l2 = Pe.trans, f2 = c2.keys || Yn(v2, c2);
            if (!f2)
              throw new Error("Keys missing");
            return "delete" !== (c2 = "add" === c2.type || "put" === c2.type ? _(_({}, c2), { keys: f2 }) : _({}, c2)).type && (c2.values = i([], c2.values, true)), c2.keys && (c2.keys = i([], c2.keys, true)), e4 = y2, n3 = f2, ("add" === (t3 = c2).type ? Promise.resolve([]) : e4.getMany({ trans: t3.trans, keys: n3, cache: "immutable" })).then(function(u2) {
              var s2 = f2.map(function(e5, t4) {
                var n4, r3, i2, o2 = u2[t4], a3 = { onerror: null, onsuccess: null };
                return "delete" === c2.type ? h2.fire.call(a3, e5, o2, l2) : "add" === c2.type || void 0 === o2 ? (n4 = d2.fire.call(a3, e5, c2.values[t4], l2), null == e5 && null != n4 && (c2.keys[t4] = e5 = n4, v2.outbound || O(c2.values[t4], v2.keyPath, e5))) : (n4 = Wn(o2, c2.values[t4]), (r3 = p2.fire.call(a3, n4, e5, o2, l2)) && (i2 = c2.values[t4], Object.keys(r3).forEach(function(e6) {
                  m(i2, e6) ? i2[e6] = r3[e6] : O(i2, e6, r3[e6]);
                }))), a3;
              });
              return y2.mutate(c2).then(function(e5) {
                for (var t4 = e5.failures, n4 = e5.results, r3 = e5.numFailures, e5 = e5.lastResult, i2 = 0; i2 < f2.length; ++i2) {
                  var o2 = (n4 || f2)[i2], a3 = s2[i2];
                  null == o2 ? a3.onerror && a3.onerror(t4[i2]) : a3.onsuccess && a3.onsuccess("put" === c2.type && u2[i2] ? c2.values[i2] : o2);
                }
                return { failures: t4, results: n4, numFailures: r3, lastResult: e5 };
              }).catch(function(t4) {
                return s2.forEach(function(e5) {
                  return e5.onerror && e5.onerror(t4);
                }), Promise.reject(t4);
              });
            });
          }
        } });
      } });
    } };
    function Gn(e2, t2, n2) {
      try {
        if (!t2)
          return null;
        if (t2.keys.length < e2.length)
          return null;
        for (var r2 = [], i2 = 0, o2 = 0; i2 < t2.keys.length && o2 < e2.length; ++i2)
          0 === _t(t2.keys[i2], e2[o2]) && (r2.push(n2 ? j(t2.values[i2]) : t2.values[i2]), ++o2);
        return r2.length === e2.length ? r2 : null;
      } catch (e3) {
        return null;
      }
    }
    var Hn = { stack: "dbcore", level: -1, create: function(t2) {
      return { table: function(e2) {
        var n2 = t2.table(e2);
        return _(_({}, n2), { getMany: function(t3) {
          if (!t3.cache)
            return n2.getMany(t3);
          var e3 = Gn(t3.keys, t3.trans._cache, "clone" === t3.cache);
          return e3 ? je.resolve(e3) : n2.getMany(t3).then(function(e4) {
            return t3.trans._cache = { keys: t3.keys, values: "clone" === t3.cache ? j(e4) : e4 }, e4;
          });
        }, mutate: function(e3) {
          return "add" !== e3.type && (e3.trans._cache = null), n2.mutate(e3);
        } });
      } };
    } };
    function Xn(e2, t2) {
      return "readonly" === e2.trans.mode && !!e2.subscr && !e2.trans.explicit && "disabled" !== e2.trans.db._options.cache && !t2.schema.primaryKey.outbound;
    }
    function Jn(e2, t2) {
      switch (e2) {
        case "query":
          return t2.values && !t2.unique;
        case "get":
        case "getMany":
        case "count":
        case "openCursor":
          return false;
      }
    }
    var $n = { stack: "dbcore", level: 0, name: "Observability", create: function(r2) {
      var m2 = r2.schema.name, b2 = new Kn(r2.MIN_KEY, r2.MAX_KEY);
      return _(_({}, r2), { transaction: function(e2, t2, n2) {
        if (Pe.subscr && "readonly" !== t2)
          throw new Z.ReadOnly("Readwrite transaction in liveQuery context. Querier source: ".concat(Pe.querier));
        return r2.transaction(e2, t2, n2);
      }, table: function(d2) {
        function e2(e3) {
          var e3 = (t3 = e3.query).index, t3 = t3.range;
          return [e3, new Kn(null !== (e3 = t3.lower) && void 0 !== e3 ? e3 : r2.MIN_KEY, null !== (t3 = t3.upper) && void 0 !== t3 ? t3 : r2.MAX_KEY)];
        }
        var p2 = r2.table(d2), y2 = p2.schema, v2 = y2.primaryKey, c2 = v2.extractKey, l2 = v2.outbound, t2 = _(_({}, p2), { mutate: function(t3) {
          function n2(e4) {
            return e4 = "idb://".concat(m2, "/").concat(d2, "/").concat(e4), i2[e4] || (i2[e4] = new Kn());
          }
          var e3, o2, a2, r3 = t3.trans, i2 = t3.mutatedParts || (t3.mutatedParts = {}), u2 = n2(""), s2 = n2(":dels"), c3 = t3.type, l3 = "deleteRange" === t3.type ? [t3.range] : "delete" === t3.type ? [t3.keys] : t3.values.length < 50 ? [Yn(v2, t3).filter(function(e4) {
            return e4;
          }), t3.values] : [], f3 = l3[0], h2 = l3[1], l3 = t3.trans._cache;
          return g(f3) ? (u2.addKeys(f3), (l3 = "delete" === c3 || f3.length === h2.length ? Gn(f3, l3) : null) || "add" === c3 || s2.addKeys(f3), (l3 || h2) && (e3 = n2, o2 = l3, a2 = h2, y2.indexes.forEach(function(t4) {
            var n3 = e3(t4.name || "");
            function r4(e4) {
              return null != e4 ? t4.extractKey(e4) : null;
            }
            function i3(e4) {
              return t4.multiEntry && g(e4) ? e4.forEach(function(e5) {
                return n3.addKey(e5);
              }) : n3.addKey(e4);
            }
            (o2 || a2).forEach(function(e4, t5) {
              var n4 = o2 && r4(o2[t5]), t5 = a2 && r4(a2[t5]);
              0 !== _t(n4, t5) && (null != n4 && i3(n4), null != t5 && i3(t5));
            });
          }))) : f3 ? (h2 = { from: f3.lower, to: f3.upper }, s2.add(h2), u2.add(h2)) : (u2.add(b2), s2.add(b2), y2.indexes.forEach(function(e4) {
            return n2(e4.name).add(b2);
          })), p2.mutate(t3).then(function(e4) {
            return !f3 || "add" !== t3.type && "put" !== t3.type || u2.addKeys(e4.results), r3.mutatedParts = Tn(r3.mutatedParts || {}, i2), e4;
          });
        } }), f2 = { get: function(e3) {
          return [v2, new Kn(e3.key)];
        }, getMany: function(e3) {
          return [v2, new Kn().addKeys(e3.keys)];
        }, count: e2, query: e2, openCursor: e2 };
        return k(f2).forEach(function(s2) {
          t2[s2] = function(i2) {
            var e3 = Pe.subscr, t3 = !!e3, n2 = Xn(Pe, p2) && Jn(s2, i2) ? i2.obsSet = {} : e3;
            if (t3) {
              var r3 = function(e4) {
                e4 = "idb://".concat(m2, "/").concat(d2, "/").concat(e4);
                return n2[e4] || (n2[e4] = new Kn());
              }, o2 = r3(""), a2 = r3(":dels"), e3 = f2[s2](i2), t3 = e3[0], e3 = e3[1];
              if (r3(t3.name || "").add(e3), !t3.isPrimaryKey) {
                if ("count" !== s2) {
                  var u2 = "query" === s2 && l2 && i2.values && p2.query(_(_({}, i2), { values: false }));
                  return p2[s2].apply(this, arguments).then(function(t4) {
                    if ("query" === s2) {
                      if (l2 && i2.values)
                        return u2.then(function(e5) {
                          e5 = e5.result;
                          return o2.addKeys(e5), t4;
                        });
                      var e4 = i2.values ? t4.result.map(c2) : t4.result;
                      (i2.values ? o2 : a2).addKeys(e4);
                    } else if ("openCursor" === s2) {
                      var n3 = t4, r4 = i2.values;
                      return n3 && Object.create(n3, { key: { get: function() {
                        return a2.addKey(n3.primaryKey), n3.key;
                      } }, primaryKey: { get: function() {
                        var e5 = n3.primaryKey;
                        return a2.addKey(e5), e5;
                      } }, value: { get: function() {
                        return r4 && o2.addKey(n3.primaryKey), n3.value;
                      } } });
                    }
                    return t4;
                  });
                }
                a2.add(b2);
              }
            }
            return p2[s2].apply(this, arguments);
          };
        }), t2;
      } });
    } };
    function Zn(e2, t2, n2) {
      if (0 === n2.numFailures)
        return t2;
      if ("deleteRange" === t2.type)
        return null;
      var r2 = t2.keys ? t2.keys.length : "values" in t2 && t2.values ? t2.values.length : 1;
      if (n2.numFailures === r2)
        return null;
      t2 = _({}, t2);
      return g(t2.keys) && (t2.keys = t2.keys.filter(function(e3, t3) {
        return !(t3 in n2.failures);
      })), "values" in t2 && g(t2.values) && (t2.values = t2.values.filter(function(e3, t3) {
        return !(t3 in n2.failures);
      })), t2;
    }
    function er(e2, t2) {
      return n2 = e2, (void 0 === (r2 = t2).lower || (r2.lowerOpen ? 0 < _t(n2, r2.lower) : 0 <= _t(n2, r2.lower))) && (e2 = e2, void 0 === (t2 = t2).upper || (t2.upperOpen ? _t(e2, t2.upper) < 0 : _t(e2, t2.upper) <= 0));
      var n2, r2;
    }
    function tr(e2, u2, t2, n2, r2, s2) {
      if (!t2 || 0 === t2.length)
        return e2;
      var i2 = u2.query.index, c2 = n2.schema.primaryKey.extractKey, l2 = i2.extractKey, o2 = (i2.lowLevelIndex || i2).extractKey, t2 = t2.reduce(function(e3, t3) {
        var n3 = e3, r3 = "add" === t3.type || "put" === t3.type ? t3.values.filter(function(e4) {
          return er(l2(e4), u2.query.range);
        }).map(function(e4) {
          return e4 = j(e4), s2 && Object.freeze(e4), e4;
        }) : [];
        switch (t3.type) {
          case "add":
            n3 = e3.concat(u2.values ? r3 : r3.map(function(e4) {
              return c2(e4);
            }));
            break;
          case "put":
            var i3 = new Kn().addKeys(t3.values.map(function(e4) {
              return c2(e4);
            })), n3 = e3.filter(function(e4) {
              e4 = u2.values ? c2(e4) : e4;
              return !An(new Kn(e4), i3);
            }).concat(u2.values ? r3 : r3.map(function(e4) {
              return c2(e4);
            }));
            break;
          case "delete":
            var o3 = new Kn().addKeys(t3.keys);
            n3 = e3.filter(function(e4) {
              e4 = u2.values ? c2(e4) : e4;
              return !An(new Kn(e4), o3);
            });
            break;
          case "deleteRange":
            var a2 = t3.range;
            n3 = e3.filter(function(e4) {
              return !er(c2(e4), a2);
            });
        }
        return n3;
      }, e2);
      return t2 === e2 ? e2 : (t2.sort(function(e3, t3) {
        return _t(o2(e3), o2(t3)) || _t(c2(e3), c2(t3));
      }), u2.limit && u2.limit < 1 / 0 && (t2.length > u2.limit ? t2.length = u2.limit : e2.length === u2.limit && t2.length < u2.limit && (r2.dirty = true)), s2 ? Object.freeze(t2) : t2);
    }
    function nr(e2, t2) {
      return 0 === _t(e2.lower, t2.lower) && 0 === _t(e2.upper, t2.upper) && !!e2.lowerOpen == !!t2.lowerOpen && !!e2.upperOpen == !!t2.upperOpen;
    }
    function rr(e2, t2) {
      return function(e3, t3, n2, r2) {
        if (void 0 === e3)
          return void 0 !== t3 ? -1 : 0;
        if (void 0 === t3)
          return 1;
        if (0 === (t3 = _t(e3, t3))) {
          if (n2 && r2)
            return 0;
          if (n2)
            return 1;
          if (r2)
            return -1;
        }
        return t3;
      }(e2.lower, t2.lower, e2.lowerOpen, t2.lowerOpen) <= 0 && 0 <= function(e3, t3, n2, r2) {
        if (void 0 === e3)
          return void 0 !== t3 ? 1 : 0;
        if (void 0 === t3)
          return -1;
        if (0 === (t3 = _t(e3, t3))) {
          if (n2 && r2)
            return 0;
          if (n2)
            return -1;
          if (r2)
            return 1;
        }
        return t3;
      }(e2.upper, t2.upper, e2.upperOpen, t2.upperOpen);
    }
    function ir(n2, r2, i2, e2) {
      n2.subscribers.add(i2), e2.addEventListener("abort", function() {
        var e3, t2;
        n2.subscribers.delete(i2), 0 === n2.subscribers.size && (e3 = n2, t2 = r2, setTimeout(function() {
          0 === e3.subscribers.size && T(t2, e3);
        }, 3e3));
      });
    }
    var or = { stack: "dbcore", level: 0, name: "Cache", create: function(g2) {
      var w2 = g2.schema.name;
      return _(_({}, g2), { transaction: function(y2, v2, e2) {
        var m2, t2, b2 = g2.transaction(y2, v2, e2);
        return "readwrite" === v2 && (t2 = (m2 = new AbortController()).signal, e2 = function(p2) {
          return function() {
            if (m2.abort(), "readwrite" === v2) {
              for (var t3 = /* @__PURE__ */ new Set(), e3 = 0, n2 = y2; e3 < n2.length; e3++) {
                var r2 = n2[e3], i2 = Rn["idb://".concat(w2, "/").concat(r2)], o2 = g2.table(r2);
                if (i2) {
                  var a2 = i2.optimisticOps.filter(function(e4) {
                    return e4.trans === b2;
                  });
                  if (0 < a2.length) {
                    i2.optimisticOps = i2.optimisticOps.filter(function(e4) {
                      return e4.trans !== b2;
                    });
                    for (var u2 = 0, s2 = Object.values(i2.queries.query); u2 < s2.length; u2++)
                      for (var c2 = s2[u2], l2 = 0, f2 = c2.slice(); l2 < f2.length; l2++) {
                        var h2, d2 = f2[l2];
                        null != d2.res && b2.mutatedParts && (p2 && !d2.dirty ? (h2 = Object.isFrozen(d2.res), h2 = tr(d2.res, d2.req, a2, o2, d2, h2), d2.dirty ? (T(c2, d2), d2.subscribers.forEach(function(e4) {
                          return t3.add(e4);
                        })) : h2 !== d2.res && (d2.res = h2, d2.promise = je.resolve({ result: h2 }))) : (d2.dirty && T(c2, d2), d2.subscribers.forEach(function(e4) {
                          return t3.add(e4);
                        })));
                      }
                  }
                }
              }
              t3.forEach(function(e4) {
                return e4();
              });
            }
          };
        }, b2.addEventListener("abort", e2(false), { signal: t2 }), b2.addEventListener("error", e2(false), { signal: t2 }), b2.addEventListener("complete", e2(true), { signal: t2 })), b2;
      }, table: function(c2) {
        var l2 = g2.table(c2), i2 = l2.schema.primaryKey;
        return _(_({}, l2), { mutate: function(t2) {
          if (i2.outbound || "disabled" === Pe.trans.db._options.cache)
            return l2.mutate(t2);
          var r2 = Rn["idb://".concat(w2, "/").concat(c2)];
          if (!r2)
            return l2.mutate(t2);
          var e2 = l2.mutate(t2);
          return "add" !== t2.type && "put" !== t2.type || !(50 <= t2.values.length || Yn(i2, t2).some(function(e3) {
            return null == e3;
          })) ? (r2.optimisticOps.push(t2), Mn(t2.mutatedParts), e2.then(function(e3) {
            0 < e3.numFailures && (T(r2.optimisticOps, t2), (e3 = Zn(0, t2, e3)) && r2.optimisticOps.push(e3), Mn(t2.mutatedParts));
          }), e2.catch(function() {
            T(r2.optimisticOps, t2), Mn(t2.mutatedParts);
          })) : e2.then(function(n2) {
            var e3 = Zn(0, _(_({}, t2), { values: t2.values.map(function(e4, t3) {
              e4 = i2.keyPath.includes(".") ? j(e4) : _({}, e4);
              return O(e4, i2.keyPath, n2.results[t3]), e4;
            }) }), n2);
            r2.optimisticOps.push(e3), queueMicrotask(function() {
              return Mn(t2.mutatedParts);
            });
          }), e2;
        }, query: function(t2) {
          if (!Xn(Pe, l2) || !Jn("query", t2))
            return l2.query(t2);
          var i3 = "immutable" === Pe.trans.db._options.cache, e2 = Pe, n2 = e2.requery, r2 = e2.signal, o2 = function(e3, t3, n3, r3) {
            var i4 = Rn["idb://".concat(e3, "/").concat(t3)];
            if (!i4)
              return [];
            if (!(t3 = i4.queries[n3]))
              return [null, false, i4, null];
            var o3 = t3[(r3.query ? r3.query.index.name : null) || ""];
            if (!o3)
              return [null, false, i4, null];
            switch (n3) {
              case "query":
                var a3 = o3.find(function(e4) {
                  return e4.req.limit === r3.limit && e4.req.values === r3.values && nr(e4.req.query.range, r3.query.range);
                });
                return a3 ? [a3, true, i4, o3] : [o3.find(function(e4) {
                  return ("limit" in e4.req ? e4.req.limit : 1 / 0) >= r3.limit && (!r3.values || e4.req.values) && rr(e4.req.query.range, r3.query.range);
                }), false, i4, o3];
              case "count":
                a3 = o3.find(function(e4) {
                  return nr(e4.req.query.range, r3.query.range);
                });
                return [a3, !!a3, i4, o3];
            }
          }(w2, c2, "query", t2), a2 = o2[0], e2 = o2[1], u2 = o2[2], s2 = o2[3];
          return a2 && e2 ? a2.obsSet = t2.obsSet : (e2 = l2.query(t2).then(function(e3) {
            var t3 = e3.result;
            if (a2.res = t3, i3) {
              for (var n3 = 0, r3 = t3.length; n3 < r3; ++n3)
                Object.freeze(t3[n3]);
              Object.freeze(t3);
            } else
              e3.result = j(t3);
            return e3;
          }).catch(function(e3) {
            return s2 && a2 && T(s2, a2), Promise.reject(e3);
          }), a2 = { obsSet: t2.obsSet, promise: e2, subscribers: /* @__PURE__ */ new Set(), type: "query", req: t2, dirty: false }, s2 ? s2.push(a2) : (s2 = [a2], (u2 = u2 || (Rn["idb://".concat(w2, "/").concat(c2)] = { queries: { query: {}, count: {} }, objs: /* @__PURE__ */ new Map(), optimisticOps: [], unsignaledParts: {} })).queries.query[t2.query.index.name || ""] = s2)), ir(a2, s2, n2, r2), a2.promise.then(function(e3) {
            return { result: tr(e3.result, t2, null == u2 ? void 0 : u2.optimisticOps, l2, a2, i3) };
          });
        } });
      } });
    } };
    function ar(e2, r2) {
      return new Proxy(e2, { get: function(e3, t2, n2) {
        return "db" === t2 ? r2 : Reflect.get(e3, t2, n2);
      } });
    }
    var ur = (sr.prototype.version = function(t2) {
      if (isNaN(t2) || t2 < 0.1)
        throw new Z.Type("Given version is not a positive number");
      if (t2 = Math.round(10 * t2) / 10, this.idbdb || this._state.isBeingOpened)
        throw new Z.Schema("Cannot add version when database is open");
      this.verno = Math.max(this.verno, t2);
      var e2 = this._versions, n2 = e2.filter(function(e3) {
        return e3._cfg.version === t2;
      })[0];
      return n2 || (n2 = new this.Version(t2), e2.push(n2), e2.sort(pn), n2.stores({}), this._state.autoSchema = false, n2);
    }, sr.prototype._whenReady = function(e2) {
      var n2 = this;
      return this.idbdb && (this._state.openComplete || Pe.letThrough || this._vip) ? e2() : new je(function(e3, t2) {
        if (n2._state.openComplete)
          return t2(new Z.DatabaseClosed(n2._state.dbOpenError));
        if (!n2._state.isBeingOpened) {
          if (!n2._options.autoOpen)
            return void t2(new Z.DatabaseClosed());
          n2.open().catch(ne);
        }
        n2._state.dbReadyPromise.then(e3, t2);
      }).then(e2);
    }, sr.prototype.use = function(e2) {
      var t2 = e2.stack, n2 = e2.create, r2 = e2.level, i2 = e2.name;
      i2 && this.unuse({ stack: t2, name: i2 });
      e2 = this._middlewares[t2] || (this._middlewares[t2] = []);
      return e2.push({ stack: t2, create: n2, level: null == r2 ? 10 : r2, name: i2 }), e2.sort(function(e3, t3) {
        return e3.level - t3.level;
      }), this;
    }, sr.prototype.unuse = function(e2) {
      var t2 = e2.stack, n2 = e2.name, r2 = e2.create;
      return t2 && this._middlewares[t2] && (this._middlewares[t2] = this._middlewares[t2].filter(function(e3) {
        return r2 ? e3.create !== r2 : !!n2 && e3.name !== n2;
      })), this;
    }, sr.prototype.open = function() {
      var e2 = this;
      return nt(Oe, function() {
        return Ln(e2);
      });
    }, sr.prototype._close = function() {
      var n2 = this._state, e2 = lt.indexOf(this);
      if (0 <= e2 && lt.splice(e2, 1), this.idbdb) {
        try {
          this.idbdb.close();
        } catch (e3) {
        }
        this.idbdb = null;
      }
      n2.dbReadyPromise = new je(function(e3) {
        n2.dbReadyResolve = e3;
      }), n2.openCanceller = new je(function(e3, t2) {
        n2.cancelOpen = t2;
      });
    }, sr.prototype.close = function(e2) {
      var t2 = (void 0 === e2 ? { disableAutoOpen: true } : e2).disableAutoOpen;
      this._close();
      e2 = this._state;
      t2 && (this._options.autoOpen = false), e2.dbOpenError = new Z.DatabaseClosed(), e2.isBeingOpened && e2.cancelOpen(e2.dbOpenError);
    }, sr.prototype.delete = function() {
      var i2 = this, n2 = 0 < arguments.length, o2 = this._state;
      return new je(function(r2, t2) {
        function e2() {
          i2.close({ disableAutoOpen: false });
          var e3 = i2._deps.indexedDB.deleteDatabase(i2.name);
          e3.onsuccess = Ue(function() {
            var e4, t3, n3;
            e4 = i2._deps, t3 = i2.name, n3 = e4.indexedDB, e4 = e4.IDBKeyRange, On(n3) || t3 === pt || xn(n3, e4).delete(t3).catch(ne), r2();
          }), e3.onerror = Qt(t2), e3.onblocked = i2._fireOnBlocked;
        }
        if (n2)
          throw new Z.InvalidArgument("Arguments not allowed in db.delete()");
        o2.isBeingOpened ? o2.dbReadyPromise.then(e2) : e2();
      });
    }, sr.prototype.backendDB = function() {
      return this.idbdb;
    }, sr.prototype.isOpen = function() {
      return null !== this.idbdb;
    }, sr.prototype.hasBeenClosed = function() {
      var e2 = this._state.dbOpenError;
      return e2 && "DatabaseClosed" === e2.name;
    }, sr.prototype.hasFailed = function() {
      return null !== this._state.dbOpenError;
    }, sr.prototype.dynamicallyOpened = function() {
      return this._state.autoSchema;
    }, Object.defineProperty(sr.prototype, "tables", { get: function() {
      var t2 = this;
      return k(this._allTables).map(function(e2) {
        return t2._allTables[e2];
      });
    }, enumerable: false, configurable: true }), sr.prototype.transaction = function() {
      var e2 = (function(e3, t2, n2) {
        var r2 = arguments.length;
        if (r2 < 2)
          throw new Z.InvalidArgument("Too few arguments");
        for (var i2 = new Array(r2 - 1); --r2; )
          i2[r2 - 1] = arguments[r2];
        return n2 = i2.pop(), [e3, E(i2), n2];
      }).apply(this, arguments);
      return this._transaction.apply(this, e2);
    }, sr.prototype._transaction = function(e2, t2, n2) {
      var r2 = this, i2 = Pe.trans;
      i2 && i2.db === this && -1 === e2.indexOf("!") || (i2 = null);
      var o2, a2, u2 = -1 !== e2.indexOf("?");
      e2 = e2.replace("!", "").replace("?", "");
      try {
        if (a2 = t2.map(function(e3) {
          e3 = e3 instanceof r2.Table ? e3.name : e3;
          if ("string" != typeof e3)
            throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
          return e3;
        }), "r" == e2 || e2 === yt)
          o2 = yt;
        else {
          if ("rw" != e2 && e2 != vt)
            throw new Z.InvalidArgument("Invalid transaction mode: " + e2);
          o2 = vt;
        }
        if (i2) {
          if (i2.mode === yt && o2 === vt) {
            if (!u2)
              throw new Z.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
            i2 = null;
          }
          i2 && a2.forEach(function(e3) {
            if (i2 && -1 === i2.storeNames.indexOf(e3)) {
              if (!u2)
                throw new Z.SubTransaction("Table " + e3 + " not included in parent transaction.");
              i2 = null;
            }
          }), u2 && i2 && !i2.active && (i2 = null);
        }
      } catch (n3) {
        return i2 ? i2._promise(null, function(e3, t3) {
          t3(n3);
        }) : ot(n3);
      }
      var s2 = (function i3(o3, a3, u3, s3, c2) {
        return je.resolve().then(function() {
          var e3 = Pe.transless || Pe, t3 = o3._createTransaction(a3, u3, o3._dbSchema, s3);
          if (t3.explicit = true, e3 = { trans: t3, transless: e3 }, s3)
            t3.idbtrans = s3.idbtrans;
          else
            try {
              t3.create(), o3._state.PR1398_maxLoop = 3;
            } catch (e4) {
              return e4.name === J.InvalidState && o3.isOpen() && 0 < --o3._state.PR1398_maxLoop ? (console.warn("Dexie: Need to reopen db"), o3._close(), o3.open().then(function() {
                return i3(o3, a3, u3, null, c2);
              })) : ot(e4);
            }
          var n3, r3 = B(c2);
          return r3 && Xe(), e3 = je.follow(function() {
            var e4;
            (n3 = c2.call(t3, t3)) && (r3 ? (e4 = Je.bind(null, null), n3.then(e4, e4)) : "function" == typeof n3.next && "function" == typeof n3.throw && (n3 = Un(n3)));
          }, e3), (n3 && "function" == typeof n3.then ? je.resolve(n3).then(function(e4) {
            return t3.active ? e4 : ot(new Z.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"));
          }) : e3.then(function() {
            return n3;
          })).then(function(e4) {
            return s3 && t3._resolve(), t3._completion.then(function() {
              return e4;
            });
          }).catch(function(e4) {
            return t3._reject(e4), ot(e4);
          });
        });
      }).bind(null, this, o2, a2, i2, n2);
      return i2 ? i2._promise(o2, s2, "lock") : Pe.trans ? nt(Pe.transless, function() {
        return r2._whenReady(s2);
      }) : this._whenReady(s2);
    }, sr.prototype.table = function(e2) {
      if (!m(this._allTables, e2))
        throw new Z.InvalidTable("Table ".concat(e2, " does not exist"));
      return this._allTables[e2];
    }, sr);
    function sr(e2, t2) {
      var o2 = this;
      this._middlewares = {}, this.verno = 0;
      var n2 = sr.dependencies;
      this._options = t2 = _({ addons: sr.addons, autoOpen: true, indexedDB: n2.indexedDB, IDBKeyRange: n2.IDBKeyRange, cache: "cloned" }, t2), this._deps = { indexedDB: t2.indexedDB, IDBKeyRange: t2.IDBKeyRange };
      n2 = t2.addons;
      this._dbSchema = {}, this._versions = [], this._storeNames = [], this._allTables = {}, this.idbdb = null, this._novip = this;
      var a2, r2, u2, i2, s2, c2 = { dbOpenError: null, isBeingOpened: false, onReadyBeingFired: null, openComplete: false, dbReadyResolve: ne, dbReadyPromise: null, cancelOpen: ne, openCanceller: null, autoSchema: true, PR1398_maxLoop: 3 };
      c2.dbReadyPromise = new je(function(e3) {
        c2.dbReadyResolve = e3;
      }), c2.openCanceller = new je(function(e3, t3) {
        c2.cancelOpen = t3;
      }), this._state = c2, this.name = e2, this.on = Et(this, "populate", "blocked", "versionchange", "close", { ready: [le, ne] }), this.on.ready.subscribe = v(this.on.ready.subscribe, function(i3) {
        return function(n3, r3) {
          sr.vip(function() {
            var t3, e3 = o2._state;
            e3.openComplete ? (e3.dbOpenError || je.resolve().then(n3), r3 && i3(n3)) : e3.onReadyBeingFired ? (e3.onReadyBeingFired.push(n3), r3 && i3(n3)) : (i3(n3), t3 = o2, r3 || i3(function e4() {
              t3.on.ready.unsubscribe(n3), t3.on.ready.unsubscribe(e4);
            }));
          });
        };
      }), this.Collection = (a2 = this, Kt(It.prototype, function(e3, t3) {
        this.db = a2;
        var n3 = bt, r3 = null;
        if (t3)
          try {
            n3 = t3();
          } catch (e4) {
            r3 = e4;
          }
        var i3 = e3._ctx, t3 = i3.table, e3 = t3.hook.reading.fire;
        this._ctx = { table: t3, index: i3.index, isPrimKey: !i3.index || t3.schema.primKey.keyPath && i3.index === t3.schema.primKey.name, range: n3, keysOnly: false, dir: "next", unique: "", algorithm: null, filter: null, replayFilter: null, justLimit: true, isMatch: null, offset: 0, limit: 1 / 0, error: r3, or: i3.or, valueMapper: e3 !== re ? e3 : null };
      })), this.Table = (r2 = this, Kt(Ot.prototype, function(e3, t3, n3) {
        this.db = r2, this._tx = n3, this.name = e3, this.schema = t3, this.hook = r2._allTables[e3] ? r2._allTables[e3].hook : Et(null, { creating: [ae, ne], reading: [ie, re], updating: [se, ne], deleting: [ue, ne] });
      })), this.Transaction = (u2 = this, Kt($t.prototype, function(e3, t3, n3, r3, i3) {
        var o3 = this;
        this.db = u2, this.mode = e3, this.storeNames = t3, this.schema = n3, this.chromeTransactionDurability = r3, this.idbtrans = null, this.on = Et(this, "complete", "error", "abort"), this.parent = i3 || null, this.active = true, this._reculock = 0, this._blockedFuncs = [], this._resolve = null, this._reject = null, this._waitingFor = null, this._waitingQueue = null, this._spinCount = 0, this._completion = new je(function(e4, t4) {
          o3._resolve = e4, o3._reject = t4;
        }), this._completion.then(function() {
          o3.active = false, o3.on.complete.fire();
        }, function(e4) {
          var t4 = o3.active;
          return o3.active = false, o3.on.error.fire(e4), o3.parent ? o3.parent._reject(e4) : t4 && o3.idbtrans && o3.idbtrans.abort(), ot(e4);
        });
      })), this.Version = (i2 = this, Kt(_n.prototype, function(e3) {
        this.db = i2, this._cfg = { version: e3, storesSource: null, dbschema: {}, tables: {}, contentUpgrade: null };
      })), this.WhereClause = (s2 = this, Kt(Wt.prototype, function(e3, t3, n3) {
        if (this.db = s2, this._ctx = { table: e3, index: ":id" === t3 ? null : t3, or: n3 }, this._cmp = this._ascending = _t, this._descending = function(e4, t4) {
          return _t(t4, e4);
        }, this._max = function(e4, t4) {
          return 0 < _t(e4, t4) ? e4 : t4;
        }, this._min = function(e4, t4) {
          return _t(e4, t4) < 0 ? e4 : t4;
        }, this._IDBKeyRange = s2._deps.IDBKeyRange, !this._IDBKeyRange)
          throw new Z.MissingAPI();
      })), this.on("versionchange", function(e3) {
        0 < e3.newVersion ? console.warn("Another connection wants to upgrade database '".concat(o2.name, "'. Closing db now to resume the upgrade.")) : console.warn("Another connection wants to delete database '".concat(o2.name, "'. Closing db now to resume the delete request.")), o2.close({ disableAutoOpen: false }), o2._state.openComplete = false;
      }), this.on("blocked", function(e3) {
        !e3.newVersion || e3.newVersion < e3.oldVersion ? console.warn("Dexie.delete('".concat(o2.name, "') was blocked")) : console.warn("Upgrade '".concat(o2.name, "' blocked by other connection holding version ").concat(e3.oldVersion / 10));
      }), this._maxKey = rn(t2.IDBKeyRange), this._createTransaction = function(e3, t3, n3, r3) {
        return new o2.Transaction(e3, t3, n3, o2._options.chromeTransactionDurability, r3);
      }, this._fireOnBlocked = function(t3) {
        o2.on("blocked").fire(t3), lt.filter(function(e3) {
          return e3.name === o2.name && e3 !== o2 && !e3._state.vcFired;
        }).map(function(e3) {
          return e3.on("versionchange").fire(t3);
        });
      }, this.use(Hn), this.use(or), this.use($n), this.use(Vn), this.use(Qn);
      var l2 = new Proxy(this, { get: function(e3, t3, n3) {
        if ("_vip" === t3)
          return true;
        if ("table" === t3)
          return function(e4) {
            return ar(o2.table(e4), l2);
          };
        var r3 = Reflect.get(e3, t3, n3);
        return r3 instanceof Ot ? ar(r3, l2) : "tables" === t3 ? r3.map(function(e4) {
          return ar(e4, l2);
        }) : "_createTransaction" === t3 ? function() {
          return ar(r3.apply(this, arguments), l2);
        } : r3;
      } });
      this.vip = l2, n2.forEach(function(e3) {
        return e3(o2);
      });
    }
    var cr, W = "undefined" != typeof Symbol && "observable" in Symbol ? Symbol.observable : "@@observable", lr = (fr.prototype.subscribe = function(e2, t2, n2) {
      return this._subscribe(e2 && "function" != typeof e2 ? e2 : { next: e2, error: t2, complete: n2 });
    }, fr.prototype[W] = function() {
      return this;
    }, fr);
    function fr(e2) {
      this._subscribe = e2;
    }
    try {
      cr = { indexedDB: f.indexedDB || f.mozIndexedDB || f.webkitIndexedDB || f.msIndexedDB, IDBKeyRange: f.IDBKeyRange || f.webkitIDBKeyRange };
    } catch (e2) {
      cr = { indexedDB: null, IDBKeyRange: null };
    }
    function hr(h2) {
      var d2, p2 = false, e2 = new lr(function(r2) {
        var i2 = B(h2);
        var o2, a2 = false, u2 = {}, s2 = {}, e3 = { get closed() {
          return a2;
        }, unsubscribe: function() {
          a2 || (a2 = true, o2 && o2.abort(), c2 && Jt.storagemutated.unsubscribe(f2));
        } };
        r2.start && r2.start(e3);
        var c2 = false, l2 = function() {
          return it(t2);
        };
        var f2 = function(e4) {
          Tn(u2, e4), In(s2, u2) && l2();
        }, t2 = function() {
          var t3, n2, e4;
          !a2 && cr.indexedDB && (u2 = {}, t3 = {}, o2 && o2.abort(), o2 = new AbortController(), e4 = function(e5) {
            var t4 = Fe();
            try {
              i2 && Xe();
              var n3 = He(h2, e5);
              return n3 = i2 ? n3.finally(Je) : n3;
            } finally {
              t4 && Me();
            }
          }(n2 = { subscr: t3, signal: o2.signal, requery: l2, querier: h2, trans: null }), Promise.resolve(e4).then(function(e5) {
            p2 = true, d2 = e5, a2 || n2.signal.aborted || (u2 = {}, function(e6) {
              for (var t4 in e6)
                if (m(e6, t4))
                  return;
              return 1;
            }(s2 = t3) || c2 || (Jt(Ht, f2), c2 = true), it(function() {
              return !a2 && r2.next && r2.next(e5);
            }));
          }, function(e5) {
            p2 = false, ["DatabaseClosedError", "AbortError"].includes(null == e5 ? void 0 : e5.name) || a2 || it(function() {
              a2 || r2.error && r2.error(e5);
            });
          }));
        };
        return setTimeout(l2, 0), e3;
      });
      return e2.hasValue = function() {
        return p2;
      }, e2.getValue = function() {
        return d2;
      }, e2;
    }
    var dr = ur;
    function pr(e2) {
      var t2 = vr;
      try {
        vr = true, Jt.storagemutated.fire(e2), Nn(e2, true);
      } finally {
        vr = t2;
      }
    }
    r(dr, _(_({}, te), { delete: function(e2) {
      return new dr(e2, { addons: [] }).delete();
    }, exists: function(e2) {
      return new dr(e2, { addons: [] }).open().then(function(e3) {
        return e3.close(), true;
      }).catch("NoSuchDatabaseError", function() {
        return false;
      });
    }, getDatabaseNames: function(e2) {
      try {
        return t2 = dr.dependencies, n2 = t2.indexedDB, t2 = t2.IDBKeyRange, (On(n2) ? Promise.resolve(n2.databases()).then(function(e3) {
          return e3.map(function(e4) {
            return e4.name;
          }).filter(function(e4) {
            return e4 !== pt;
          });
        }) : xn(n2, t2).toCollection().primaryKeys()).then(e2);
      } catch (e3) {
        return ot(new Z.MissingAPI());
      }
      var t2, n2;
    }, defineClass: function() {
      return function(e2) {
        a(this, e2);
      };
    }, ignoreTransaction: function(e2) {
      return Pe.trans ? nt(Pe.transless, e2) : e2();
    }, vip: Pn, async: function(t2) {
      return function() {
        try {
          var e2 = Un(t2.apply(this, arguments));
          return e2 && "function" == typeof e2.then ? e2 : je.resolve(e2);
        } catch (e3) {
          return ot(e3);
        }
      };
    }, spawn: function(e2, t2, n2) {
      try {
        var r2 = Un(e2.apply(n2, t2 || []));
        return r2 && "function" == typeof r2.then ? r2 : je.resolve(r2);
      } catch (e3) {
        return ot(e3);
      }
    }, currentTransaction: { get: function() {
      return Pe.trans || null;
    } }, waitFor: function(e2, t2) {
      t2 = je.resolve("function" == typeof e2 ? dr.ignoreTransaction(e2) : e2).timeout(t2 || 6e4);
      return Pe.trans ? Pe.trans.waitFor(t2) : t2;
    }, Promise: je, debug: { get: function() {
      return F;
    }, set: function(e2) {
      M(e2, "dexie" === e2 ? function() {
        return true;
      } : at);
    } }, derive: o, extend: a, props: r, override: v, Events: Et, on: Jt, liveQuery: hr, extendObservabilitySet: Tn, getByKeyPath: x, setByKeyPath: O, delByKeyPath: function(t2, e2) {
      "string" == typeof e2 ? O(t2, e2, void 0) : "length" in e2 && [].map.call(e2, function(e3) {
        O(t2, e3, void 0);
      });
    }, shallowClone: P, deepClone: j, getObjectDiff: Wn, cmp: _t, asap: w, minKey: -1 / 0, addons: [], connections: lt, errnames: J, dependencies: cr, cache: Rn, semVer: e, version: e.split(".").map(function(e2) {
      return parseInt(e2);
    }).reduce(function(e2, t2, n2) {
      return e2 + t2 / Math.pow(10, 2 * n2);
    }) })), dr.maxKey = rn(dr.dependencies.IDBKeyRange), "undefined" != typeof dispatchEvent && "undefined" != typeof addEventListener && (Jt(Ht, function(e2) {
      var t2;
      vr || (ft ? (t2 = document.createEvent("CustomEvent")).initCustomEvent(Xt, true, true, e2) : t2 = new CustomEvent(Xt, { detail: e2 }), vr = true, dispatchEvent(t2), vr = false);
    }), addEventListener(Xt, function(e2) {
      e2 = e2.detail;
      vr || pr(e2);
    }));
    var yr, vr = false;
    return "undefined" != typeof BroadcastChannel ? ("function" == typeof (yr = new BroadcastChannel(Xt)).unref && yr.unref(), Jt(Ht, function(e2) {
      vr || yr.postMessage(e2);
    }), yr.onmessage = function(e2) {
      e2.data && pr(e2.data);
    }) : "undefined" != typeof self && "undefined" != typeof navigator && (Jt(Ht, function(t2) {
      try {
        vr || ("undefined" != typeof localStorage && localStorage.setItem(Xt, JSON.stringify({ trig: Math.random(), changedParts: t2 })), "object" == typeof self.clients && i([], self.clients.matchAll({ includeUncontrolled: true }), true).forEach(function(e2) {
          return e2.postMessage({ type: Xt, changedParts: t2 });
        }));
      } catch (e2) {
      }
    }), "undefined" != typeof addEventListener && addEventListener("storage", function(e2) {
      e2.key !== Xt || (e2 = JSON.parse(e2.newValue)) && pr(e2.changedParts);
    }), (e = self.document && navigator.serviceWorker) && e.addEventListener("message", function(e2) {
      e2 = e2.data;
      e2 && e2.type === Xt && pr(e2.changedParts);
    })), je.rejectionMapper = function(e2, t2) {
      return !e2 || e2 instanceof Q || e2 instanceof TypeError || e2 instanceof SyntaxError || !e2.name || !ee[e2.name] ? e2 : (t2 = new ee[e2.name](t2 || e2.message, e2), "stack" in e2 && l(t2, "stack", { get: function() {
        return this.inner.stack;
      } }), t2);
    }, M(F, at), _(ur, Object.freeze({ __proto__: null, Dexie: ur, liveQuery: hr, Entity: wt, cmp: _t, default: ur, RangeSet: Kn, mergeRanges: jn, rangesOverlap: An }), { default: ur }), ur;
  });
})(dexie_min);
var dexie_minExports = dexie_min.exports;
const _Dexie = /* @__PURE__ */ getDefaultExportFromCjs(dexie_minExports);
const DexieSymbol = Symbol.for("Dexie");
const Dexie = globalThis[DexieSymbol] || (globalThis[DexieSymbol] = _Dexie);
if (_Dexie.semVer !== Dexie.semVer) {
  throw new Error(`Two different versions of Dexie loaded in the same app: ${_Dexie.semVer} and ${Dexie.semVer}`);
}
const db = new Dexie("database");
db.version(1).stores({
  cache: "&pathname, value"
});
function find_table({ table_name }) {
  return db.tables.find(function pass(table) {
    return table.name === table_name;
  });
}
function send_message({ text: text2, variant, duration, buttons }) {
  message.set({
    buttons,
    duration,
    variant,
    on_expire: function run7({ close: close2 }) {
      close2();
    },
    priority: 1,
    text: text2
  });
}
function send_error({ text: text2 }) {
  send_message({
    text: text2,
    variant: "error",
    duration: 15e3,
    buttons: [
      {
        label: "Close",
        icon_path: "",
        icon_position: "left",
        action: function run7() {
          message.set(false);
        }
      }
    ]
  });
}
const uncacheable = {};
const ROOT = "/api";
const CURRENTLY_VISITING = /* @__PURE__ */ new Set();
let $store_cache_touches = {};
store_cache_touches.subscribe(function watch(value) {
  return $store_cache_touches = value;
});
const http = {
  /**
   * Request a resource.
   *
   *
   * > **Note**\
   * > Resources are cached in IndexedDB.
   *
   * > **Note**\
   * > This method will invalidate specific cache entries automatically whenever it detects an entry older than 10 seconds in production.
   * @template [T =  any]
   * @param {GetPayload} payload
   * @return {Promise<Unsafe<T>>}
   * Unsafe with error when the server responds with a status >= 300\
   * Unsafe with error when `pathname` doesn't start with `'/'`
   */
  async get({ pathname, headers = {}, using_cache = true }) {
    while (CURRENTLY_VISITING.has(pathname)) {
      await delay({ milliseconds: 100 });
    }
    CURRENTLY_VISITING.add(pathname);
    const NOW = Date.now();
    const LAST_TOUCH = $store_cache_touches[pathname];
    const [CACHED, CACHE_ERROR] = await cache_get({ pathname }) ?? false;
    if (CACHE_ERROR) {
      CURRENTLY_VISITING.delete(pathname);
      return error(CACHE_ERROR);
    }
    if (using_cache && CACHED && LAST_TOUCH) {
      const DELTA = NOW - LAST_TOUCH;
      if (DELTA < CACHE_LIFETIME) {
        console.info(
          `%c cache hit ${pathname}`,
          "background: #222; color: #bada55"
        );
        CURRENTLY_VISITING.delete(pathname);
        return ok(CACHED);
      }
    }
    if (!pathname.startsWith("/")) {
      CURRENTLY_VISITING.delete(pathname);
      return error("path must start with '/'.");
    }
    try {
      const error_on_missing_token = !!uncacheable[pathname];
      const [missing_headers, e] = find_missing_headers({
        headers,
        error_on_missing_token
      });
      if (e) {
        CURRENTLY_VISITING.delete(pathname);
        return error(e);
      }
      const response = await fetch(`${ROOT}${pathname}`, {
        headers: {
          ...headers,
          ...missing_headers
        }
      });
      if (response.status >= 300) {
        CURRENTLY_VISITING.delete(pathname);
        return error(`Request failed with status ${response.status}.`);
      }
      let result = await response.json();
      if (using_cache) {
        const [, SET_ERROR] = await cache_set({ pathname, value: result });
        if (SET_ERROR) {
          CURRENTLY_VISITING.delete(pathname);
          return error(SET_ERROR);
        }
        $store_cache_touches[pathname] = Date.now();
        store_cache_touches.set($store_cache_touches);
      }
      CURRENTLY_VISITING.delete(pathname);
      return ok(result);
    } catch (e) {
      CURRENTLY_VISITING.delete(pathname);
      return error(e);
    }
  },
  /**
   * Send a delete request.
   * @template [T =  any]
   * @param {DeletePayload} payload
   * @return {Promise<Unsafe<T>>}
   * Unsafe with error when the server responds with a status >= 300\
   * Unsafe with error when `pathname` doesn't start with `'/'`
   */
  async delete({ pathname, headers = {} }) {
    while (CURRENTLY_VISITING.has(pathname)) {
      await delay({ milliseconds: 100 });
    }
    if (!pathname.startsWith("/")) {
      CURRENTLY_VISITING.delete(pathname);
      return error("path must start with '/'.");
    }
    try {
      const error_on_missing_token = !!uncacheable[pathname];
      const [missing_headers, e] = find_missing_headers({
        headers,
        error_on_missing_token
      });
      if (e) {
        CURRENTLY_VISITING.delete(pathname);
        return error(e);
      }
      CURRENTLY_VISITING.add(pathname);
      const response = await fetch(`${ROOT}${pathname}`, {
        method: "DELETE",
        headers: {
          ...headers,
          ...missing_headers
        }
      });
      if (response.status >= 300) {
        CURRENTLY_VISITING.delete(pathname);
        return error(`Request failed with status ${response.status}.`);
      }
      const result = await response.json();
      CURRENTLY_VISITING.delete(pathname);
      return ok(result);
    } catch (e) {
      CURRENTLY_VISITING.delete(pathname);
      return error(e);
    }
  },
  /**
   * Send a resource.
   * @template [T = any]
   * @param {PostPayload} payload
   * @return {Promise<Unsafe<T>>}
   * Unsafe with error when the server responds with a status >= 300\
   * Unsafe with error when `pathname` doesn't start with `'/'`
   */
  async post({ pathname, body = "", headers = {} }) {
    while (CURRENTLY_VISITING.has(pathname)) {
      await delay({ milliseconds: 100 });
    }
    if (!pathname.startsWith("/")) {
      CURRENTLY_VISITING.delete(pathname);
      return error("path must start with '/'.");
    }
    try {
      const error_on_missing_token = !!uncacheable[pathname];
      const [missing_headers, e] = find_missing_headers({
        headers,
        error_on_missing_token
      });
      if (e) {
        CURRENTLY_VISITING.delete(pathname);
        return error(e);
      }
      CURRENTLY_VISITING.add(pathname);
      const response = await fetch(`${ROOT}${pathname}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...headers,
          ...missing_headers
        },
        body
      });
      if (response.status >= 300) {
        CURRENTLY_VISITING.delete(pathname);
        return error(`Request failed with status ${response.status}.`);
      }
      const result = await response.json();
      CURRENTLY_VISITING.delete(pathname);
      return ok(result);
    } catch (e) {
      CURRENTLY_VISITING.delete(pathname);
      return error(e);
    }
  },
  /**
   * Update an existing resource.
   * @template [T =  any]
   * @param {PutPayload} payload
   * @return {Promise<Unsafe<T>>}
   * Unsafe with error when the server responds with a status >= 300\
   * Unsafe with error when `pathname` doesn't start with `'/'`
   */
  async put({ pathname, body = "", headers = {} }) {
    while (CURRENTLY_VISITING.has(pathname)) {
      await delay({ milliseconds: 100 });
    }
    if (!pathname.startsWith("/")) {
      CURRENTLY_VISITING.delete(pathname);
      return error("path must start with '/'.");
    }
    try {
      const error_on_missing_token = !!uncacheable[pathname];
      const [missing_headers, e] = find_missing_headers({
        headers,
        error_on_missing_token
      });
      if (e) {
        CURRENTLY_VISITING.delete(pathname);
        return error(e);
      }
      const response = await fetch(`${ROOT}${pathname}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          ...headers,
          ...missing_headers
        },
        body
      });
      if (response.status >= 300) {
        CURRENTLY_VISITING.delete(pathname);
        return error(`Request failed with status ${response.status}.`);
      }
      return ok(await response.json());
    } catch (e) {
      CURRENTLY_VISITING.delete(pathname);
      return error(e);
    }
  },
  /**
   * Invalidate all cache.\
   * This will delete all IndexedDB databases.
   * @returns {Promise<void>}
   */
  async invalidate() {
    const delete_requests = [];
    const databases = await indexedDB.databases();
    for (const database of databases) {
      if (!database.name) {
        continue;
      }
      const delete_request = indexedDB.deleteDatabase(database.name);
      delete_requests.push(
        new Promise(function run7(resolve) {
          delete_request.addEventListener("blocked", resolve);
          delete_request.addEventListener("error", resolve);
          delete_request.addEventListener("success", resolve);
          delete_request.addEventListener("upgradeneeded", resolve);
        })
      );
    }
    await Promise.all(delete_requests);
    const cache_keys = await caches.keys();
    const promises_cache_delete = [];
    for (const cache_key of cache_keys) {
      promises_cache_delete.push(caches.delete(cache_key));
    }
    await Promise.all(promises_cache_delete);
    notify();
    store_cache_touches.set({});
  }
};
function notify() {
  send_message({
    text: `Your http cache has just been invalidated.`,
    buttons: [
      {
        label: "Close",
        action: function run7({ close: close2 }) {
          close2();
        },
        icon_path: "",
        icon_position: "left"
      }
    ],
    duration: 1e4,
    variant: "information"
  });
}
function find_missing_headers({ headers, error_on_missing_token = true }) {
  const hasAuthorization = !!Object.keys(headers).find(function pass(key) {
    return key.trim() === "authorization";
  });
  const missing_headers = {};
  if (!hasAuthorization) {
    const token = get_store_value(store_token);
    if (!token) {
      if (!error_on_missing_token) {
        return ok(missing_headers);
      }
      return error("token not found.");
    }
    missing_headers["authorization"] = `Bearer ${token.value}`;
  }
  return ok(missing_headers);
}
async function cache_get({ pathname }) {
  const table = find_table({ table_name: "cache" }) ?? false;
  if (!table) {
    return error("Could not find cache table.");
  }
  const result = await table.get(pathname);
  return ok((result == null ? void 0 : result.value) ?? false);
}
async function cache_set({ pathname, value }) {
  const table = find_table({ table_name: "cache" }) ?? false;
  if (!table) {
    return error("Could not find cache table.");
  }
  return ok(await table.put({ pathname, value }));
}
async function find_all() {
  return http.get({ pathname: "/todos", using_cache: false });
}
async function add({ description }) {
  return http.post({
    pathname: `/todos`,
    body: description,
    headers: {
      "content-type": "text/plain"
    }
  });
}
async function remove({ id }) {
  return http.delete({ pathname: `/todos/${id}` });
}
async function toggle({ id }) {
  return http.put({ pathname: `/todos/${id}/toggle` });
}
function get_then_context(ctx) {
  ctx[4] = ctx[6][0];
  ctx[5] = ctx[6][1];
}
const get_default_slot_changes = (dirty) => ({ using: dirty & /*promise*/
2 });
const get_default_slot_context = (ctx) => ({
  using: {
    todos: (
      /*todos*/
      ctx[4]
    ),
    reload: (
      /*reload*/
      ctx[0]
    )
  }
});
function create_catch_block(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_then_block(ctx) {
  get_then_context(ctx);
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*error*/
      ctx2[5]
    )
      return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      get_then_context(ctx2);
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
    i(local) {
      if (current)
        return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
}
function create_else_block(ctx) {
  let current;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    get_default_slot_context
  );
  return {
    c() {
      if (default_slot)
        default_slot.c();
    },
    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }
      current = true;
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope, promise*/
        6)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              get_default_slot_changes
            ),
            get_default_slot_context
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (default_slot)
        default_slot.d(detaching);
    }
  };
}
function create_if_block(ctx) {
  let t_value = (
    /*error*/
    ctx[5].message + ""
  );
  let t;
  return {
    c() {
      t = text(t_value);
    },
    m(target, anchor) {
      insert(target, t, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*promise*/
      2 && t_value !== (t_value = /*error*/
      ctx2[5].message + ""))
        set_data(t, t_value);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(t);
      }
    }
  };
}
function create_pending_block(ctx) {
  return {
    c: noop,
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
  };
}
function create_fragment$2(ctx) {
  let await_block_anchor;
  let promise_1;
  let current;
  let info = {
    ctx,
    current: null,
    token: null,
    hasCatch: false,
    pending: create_pending_block,
    then: create_then_block,
    catch: create_catch_block,
    value: 6,
    blocks: [, , ,]
  };
  handle_promise(promise_1 = /*promise*/
  ctx[1], info);
  return {
    c() {
      await_block_anchor = empty();
      info.block.c();
    },
    m(target, anchor) {
      insert(target, await_block_anchor, anchor);
      info.block.m(target, info.anchor = anchor);
      info.mount = () => await_block_anchor.parentNode;
      info.anchor = await_block_anchor;
      current = true;
    },
    p(new_ctx, [dirty]) {
      ctx = new_ctx;
      info.ctx = ctx;
      if (dirty & /*promise*/
      2 && promise_1 !== (promise_1 = /*promise*/
      ctx[1]) && handle_promise(promise_1, info))
        ;
      else {
        update_await_block_branch(info, ctx, dirty);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(info.block);
      current = true;
    },
    o(local) {
      for (let i = 0; i < 3; i += 1) {
        const block = info.blocks[i];
        transition_out(block);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(await_block_anchor);
      }
      info.block.d(detaching);
      info.token = null;
      info = null;
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let promise2 = find_all();
  async function reload() {
    const result = await find_all();
    $$invalidate(1, promise2 = new Promise(function run7(send) {
      send(result);
    }));
  }
  $$self.$$set = ($$props2) => {
    if ("$$scope" in $$props2)
      $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [reload, promise2, $$scope, slots];
}
class Find_all extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$2, safe_not_equal, { reload: 0 });
  }
  get reload() {
    return this.$$.ctx[0];
  }
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[9] = list[i];
  child_ctx[10] = list;
  child_ctx[11] = i;
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
    ctx[9].description + ""
  );
  let t1;
  let label_for_value;
  let t2;
  let div4;
  let div3;
  let t4;
  let div6;
  let mounted;
  let dispose;
  function change_handler() {
    return (
      /*change_handler*/
      ctx[4](
        /*todo*/
        ctx[9],
        /*each_value*/
        ctx[10],
        /*todo_index*/
        ctx[11]
      )
    );
  }
  function mouseup_handler_1() {
    return (
      /*mouseup_handler_1*/
      ctx[5](
        /*todo*/
        ctx[9],
        /*reload*/
        ctx[8]
      )
    );
  }
  return {
    c() {
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
      div3.innerHTML = `<span class="p-2">Remove</span>`;
      t4 = space();
      div6 = element("div");
      attr(input, "id", input_id_value = /*todo*/
      ctx[9].id);
      attr(input, "type", "checkbox");
      input.checked = input_checked_value = /*todo*/
      ctx[9].checked;
      attr(input, "class", "checkbox mt-2 rounded-full");
      attr(div0, "class", "grid");
      attr(span0, "class", "p-2");
      attr(div1, "class", "btn btn-ghost rounded-3xl grid justify-start");
      attr(div2, "class", "grid");
      attr(label, "for", label_for_value = /*todo*/
      ctx[9].id);
      attr(div3, "class", "btn btn-error rounded-3xl grid justify-start");
      attr(div4, "class", "grid");
      attr(div5, "class", "grid gap-2");
      set_style(div5, "grid-template-columns", "auto 1fr auto");
      attr(div6, "class", "pt-4");
    },
    m(target, anchor) {
      insert(target, div5, anchor);
      append(div5, div0);
      append(div0, input);
      append(div5, t0);
      append(div5, label);
      append(label, div2);
      append(div2, div1);
      append(div1, span0);
      append(span0, t1);
      append(div5, t2);
      append(div5, div4);
      append(div4, div3);
      insert(target, t4, anchor);
      insert(target, div6, anchor);
      if (!mounted) {
        dispose = [
          listen(input, "change", change_handler),
          listen(div3, "mouseup", mouseup_handler_1)
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*todos*/
      128 && input_id_value !== (input_id_value = /*todo*/
      ctx[9].id)) {
        attr(input, "id", input_id_value);
      }
      if (dirty & /*todos*/
      128 && input_checked_value !== (input_checked_value = /*todo*/
      ctx[9].checked)) {
        input.checked = input_checked_value;
      }
      if (dirty & /*todos*/
      128 && t1_value !== (t1_value = /*todo*/
      ctx[9].description + ""))
        set_data(t1, t1_value);
      if (dirty & /*todos*/
      128 && label_for_value !== (label_for_value = /*todo*/
      ctx[9].id)) {
        attr(label, "for", label_for_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(div5);
        detach(t4);
        detach(div6);
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_default_slot$1(ctx) {
  let each_1_anchor;
  let each_value = ensure_array_like(
    /*todos*/
    ctx[7].data
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      each_1_anchor = empty();
    },
    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(target, anchor);
        }
      }
      insert(target, each_1_anchor, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*todos, reload*/
      384) {
        each_value = ensure_array_like(
          /*todos*/
          ctx2[7].data
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
    d(detaching) {
      if (detaching) {
        detach(each_1_anchor);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
function create_fragment$1(ctx) {
  let div1;
  let input;
  let t0;
  let div0;
  let t2;
  let div2;
  let t3;
  let findall;
  let current;
  let mounted;
  let dispose;
  let findall_props = {
    $$slots: {
      default: [
        create_default_slot$1,
        ({ using: { todos, reload } }) => ({ 7: todos, 8: reload }),
        ({ using: todos_todos_reload_reload }) => (todos_todos_reload_reload ? 128 : 0) | (todos_todos_reload_reload ? 256 : 0)
      ]
    },
    $$scope: { ctx }
  };
  findall = new Find_all({ props: findall_props });
  ctx[6](findall);
  return {
    c() {
      div1 = element("div");
      input = element("input");
      t0 = space();
      div0 = element("div");
      div0.innerHTML = `<span>+ Add</span>`;
      t2 = space();
      div2 = element("div");
      t3 = space();
      create_component(findall.$$.fragment);
      attr(input, "type", "text");
      attr(input, "placeholder", "Type here");
      attr(input, "class", "input input-bordered w-96 max-w-xs rounded-3xl");
      attr(div0, "class", "w-20 btn btn-ghost rounded-3xl");
      attr(div1, "class", "grid w-96 gap-2");
      set_style(div1, "grid-template-columns", "auto 1fr");
      attr(div2, "class", "pt-4");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, input);
      set_input_value(
        input,
        /*description*/
        ctx[0]
      );
      append(div1, t0);
      append(div1, div0);
      insert(target, t2, anchor);
      insert(target, div2, anchor);
      insert(target, t3, anchor);
      mount_component(findall, target, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            input,
            "input",
            /*input_input_handler*/
            ctx[2]
          ),
          listen(
            div0,
            "mouseup",
            /*mouseup_handler*/
            ctx[3]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*description*/
      1 && input.value !== /*description*/
      ctx2[0]) {
        set_input_value(
          input,
          /*description*/
          ctx2[0]
        );
      }
      const findall_changes = {};
      if (dirty & /*$$scope, todos, reload*/
      4480) {
        findall_changes.$$scope = { dirty, ctx: ctx2 };
      }
      findall.$set(findall_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(findall.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(findall.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div1);
        detach(t2);
        detach(div2);
        detach(t3);
      }
      ctx[6](null);
      destroy_component(findall, detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let description = "";
  let find_all2;
  function input_input_handler() {
    description = this.value;
    $$invalidate(0, description);
  }
  const mouseup_handler = async function run7() {
    const [, error2] = await add({ description });
    if (error2) {
      send_error({ text: error2.message });
      return;
    }
    $$invalidate(0, description = "");
    find_all2.reload();
  };
  const change_handler = async function toggle_todo(todo, each_value, todo_index) {
    const [, error2] = await toggle({ id: todo.id });
    if (error2) {
      each_value[todo_index].checked = !todo.checked;
      send_error({ text: error2.message });
      return;
    }
  };
  const mouseup_handler_1 = async function remove_todo(todo, reload) {
    const [, error2] = await remove({ id: todo.id });
    if (error2) {
      return;
    }
    reload();
  };
  function findall_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      find_all2 = $$value;
      $$invalidate(1, find_all2);
    });
  }
  return [
    description,
    find_all2,
    input_input_handler,
    mouseup_handler,
    change_handler,
    mouseup_handler_1,
    findall_binding
  ];
}
class Home_page extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment$1, safe_not_equal, {});
  }
}
function create_default_slot_1(ctx) {
  let homepage;
  let current;
  homepage = new Home_page({});
  return {
    c() {
      create_component(homepage.$$.fragment);
    },
    m(target, anchor) {
      mount_component(homepage, target, anchor);
      current = true;
    },
    i(local) {
      if (current)
        return;
      transition_in(homepage.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(homepage.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(homepage, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let route;
  let current;
  route = new Route({
    props: {
      path: "*",
      $$slots: { default: [create_default_slot_1] },
      $$scope: { ctx }
    }
  });
  return {
    c() {
      create_component(route.$$.fragment);
    },
    m(target, anchor) {
      mount_component(route, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const route_changes = {};
      if (dirty & /*$$scope*/
      1) {
        route_changes.$$scope = { dirty, ctx: ctx2 };
      }
      route.$set(route_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(route.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(route.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(route, detaching);
    }
  };
}
function create_fragment(ctx) {
  let div;
  let router;
  let t;
  let message2;
  let current;
  router = new Router({
    props: {
      $$slots: { default: [create_default_slot] },
      $$scope: { ctx }
    }
  });
  message2 = new Message({});
  return {
    c() {
      div = element("div");
      create_component(router.$$.fragment);
      t = space();
      create_component(message2.$$.fragment);
      attr(div, "class", "grid justify-center content-center h-full w-full");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(router, div, null);
      insert(target, t, anchor);
      mount_component(message2, target, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      const router_changes = {};
      if (dirty & /*$$scope*/
      1) {
        router_changes.$$scope = { dirty, ctx: ctx2 };
      }
      router.$set(router_changes);
    },
    i(local) {
      if (current)
        return;
      transition_in(router.$$.fragment, local);
      transition_in(message2.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(router.$$.fragment, local);
      transition_out(message2.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach(div);
        detach(t);
      }
      destroy_component(router);
      destroy_component(message2, detaching);
    }
  };
}
class Main extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, null, create_fragment, safe_not_equal, {});
  }
}
new Main({
  target: document.getElementById("main")
});
//# sourceMappingURL=index.js.map
