import { FC, useMemo, useRef, useState } from "react"
import { Animated, FlatList, View, ViewProps } from "react-native"

type Props = ViewProps & {
  data: any[]
  renderItem: any
  keyExtractor: any
  ItemSeparatorComponent?: any
  contentContainerStyle?: any
}

export const ListWithFadingDot: FC<Props> = (props) => {
  const { data, renderItem, keyExtractor, ItemSeparatorComponent, style, contentContainerStyle, ...rest } = props
  const [listHeight, setListHeight] = useState(1)
  const [contentHeight, setContentHeight] = useState(1)
  const scrollY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current
  const fadeTimeout = useRef<NodeJS.Timeout | null>(null)

  function handleScroll(e: any) {
    const y = e.nativeEvent.contentOffset.y || 0
    scrollY.setValue(y)
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current)
    Animated.timing(opacity, { toValue: 1, duration: 120, useNativeDriver: true }).start()
    fadeTimeout.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start()
    }, 650)
  }

  const maxScroll = useMemo(() => Math.max(1, contentHeight - listHeight), [contentHeight, listHeight])
  const travel = useMemo(() => Math.max(0, listHeight - 24), [listHeight])
  const translateY = scrollY.interpolate({ inputRange: [0, maxScroll], outputRange: [0, travel], extrapolate: "clamp" })

  return (
    <View style={[{ flex: 1, position: "relative" }, style]} onLayout={(e) => setListHeight(e.nativeEvent.layout.height)} {...rest}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onContentSizeChange={(w, h) => setContentHeight(h)}
        decelerationRate="fast"
        style={{ flex: 1 }}
      />
      {contentHeight > listHeight && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 4,
            width: 6,
            height: 24,
            borderRadius: 3,
            backgroundColor: "rgba(0,0,0,0.35)",
            opacity,
            transform: [{ translateY }],
          }}
        />
      )}
    </View>
  )
}



