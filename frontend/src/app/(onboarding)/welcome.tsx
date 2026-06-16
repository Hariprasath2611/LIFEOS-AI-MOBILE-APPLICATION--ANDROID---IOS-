import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { GlassCard } from '../../components/GlassCard';
import { GlassButton } from '../../components/GlassButton';

export default function OnboardingWizard() {
  const [step, setStep] = useState(0);
  
  // Selection states
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);

  const { updateProfile, user } = useAuthStore();
  const router = useRouter();

  const goalOptions = ['Career Growth', 'Physical Fitness', 'Financial Freedom', 'Skill Mastery', 'Habit Building', 'Stress Reduction'];
  const interestOptions = ['Software Development', 'Artificial Intelligence', 'Healthy Living', 'Personal Finance', 'Creative Arts', 'Entrepreneurship', 'Time Management'];
  const topicOptions = ['TypeScript & React Native', 'Machine Learning Models', 'UI/UX Mobile Design', 'Investment & Savings', 'Public Speaking', 'Mindful Meditation'];

  const toggleSelect = (item: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    try {
      await updateProfile({
        displayName: displayName || user?.email?.split('@')[0] || 'LifeOS User',
        goals: selectedGoals,
        interests: selectedInterests,
        learningTopics: selectedTopics,
        preferences: {
          notificationsEnabled: alertsEnabled,
          aiAssistantEnabled: aiEnabled,
          theme: 'dark'
        }
      });
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Failed to save onboarding configuration:', err);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, backgroundColor: '#0A0A0A', justifyContent: 'center' }}>
      
      {/* Progress Indicator */}
      <View className="flex-row justify-between mb-8 px-2">
        {Array.from({ length: 7 }).map((_, idx) => (
          <View
            key={idx}
            className={`h-1.5 rounded-full`}
            style={{
              width: '12%',
              backgroundColor: idx <= step ? '#00FF88' : 'rgba(255, 255, 255, 0.1)',
            }}
          />
        ))}
      </View>

      <GlassCard className="p-6 min-h-[360px] justify-between">
        
        {/* Step 0: Welcome */}
        {step === 0 && (
          <View>
            <Text className="text-primary text-4xl font-extrabold mb-4 text-center mt-6">LifeOS AI</Text>
            <Text className="text-white text-xl font-bold text-center mb-6">Initialize Your Second Brain</Text>
            <Text className="text-mutedText text-base text-center leading-relaxed px-4">
              Welcome to the central intelligence hub for your lifestyle. We synthesize notes, tasks, learning roadmaps, habit streak loops, and life coaching into one unified system.
            </Text>
          </View>
        )}

        {/* Step 1: Introduction */}
        {step === 1 && (
          <View>
            <Text className="text-white text-2xl font-bold mb-4 text-center">Custom Personalization</Text>
            <Text className="text-mutedText text-base text-center leading-relaxed px-2">
              Let's tailor your operating system's features to align with your personal growth vectors and target aspirations.
            </Text>
            <Text className="text-mutedText text-sm text-center mt-4">Takes less than 2 minutes to customize.</Text>
          </View>
        )}

        {/* Step 2: Choose Goals */}
        {step === 2 && (
          <View>
            <Text className="text-white text-xl font-bold mb-2">What are your primary goals?</Text>
            <Text className="text-mutedText text-sm mb-4">Select all options that align with your targets.</Text>
            <View className="flex-row flex-wrap">
              {goalOptions.map(goal => {
                const active = selectedGoals.includes(goal);
                return (
                  <TouchableOpacity
                    key={goal}
                    onPress={() => toggleSelect(goal, selectedGoals, setSelectedGoals)}
                    className={`m-1.5 px-4 py-2.5 rounded-xl border ${
                      active ? 'bg-primary/10 border-primary' : 'bg-transparent border-glassBorder'
                    }`}
                  >
                    <Text className={active ? 'text-primary font-semibold' : 'text-white'}>{goal}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Choose Interests */}
        {step === 3 && (
          <View>
            <Text className="text-white text-xl font-bold mb-2">Select your interests</Text>
            <Text className="text-mutedText text-sm mb-4">Helps us curate custom daily insights.</Text>
            <View className="flex-row flex-wrap">
              {interestOptions.map(interest => {
                const active = selectedInterests.includes(interest);
                return (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleSelect(interest, selectedInterests, setSelectedInterests)}
                    className={`m-1.5 px-4 py-2.5 rounded-xl border ${
                      active ? 'bg-primary/10 border-primary' : 'bg-transparent border-glassBorder'
                    }`}
                  >
                    <Text className={active ? 'text-primary font-semibold' : 'text-white'}>{interest}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 4: Choose Learning Topics */}
        {step === 4 && (
          <View>
            <Text className="text-white text-xl font-bold mb-2">Choose learning topics</Text>
            <Text className="text-mutedText text-sm mb-4">Select topics you want the AI to design roadmaps for.</Text>
            <View className="flex-row flex-wrap">
              {topicOptions.map(topic => {
                const active = selectedTopics.includes(topic);
                return (
                  <TouchableOpacity
                    key={topic}
                    onPress={() => toggleSelect(topic, selectedTopics, setSelectedTopics)}
                    className={`m-1.5 px-4 py-2.5 rounded-xl border ${
                      active ? 'bg-primary/10 border-primary' : 'bg-transparent border-glassBorder'
                    }`}
                  >
                    <Text className={active ? 'text-primary font-semibold' : 'text-white'}>{topic}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 5: Enable Integrations */}
        {step === 5 && (
          <View>
            <Text className="text-white text-xl font-bold mb-6">Integrations & Assistants</Text>
            
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-1 pr-4">
                <Text className="text-white text-base font-semibold">Smart Notifications</Text>
                <Text className="text-mutedText text-xs">Push reminders for tasks, habits & roadmaps</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAlertsEnabled(!alertsEnabled)}
                className={`w-12 h-6 rounded-full p-0.5 justify-center ${alertsEnabled ? 'bg-primary' : 'bg-white/10'}`}
              >
                <View className={`w-5 h-5 rounded-full bg-background ${alertsEnabled ? 'align-end ml-6' : 'align-start'}`} />
              </TouchableOpacity>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-1 pr-4">
                <Text className="text-white text-base font-semibold">Gemini Core Assistant</Text>
                <Text className="text-mutedText text-xs">Unlocks cognitive reminders, chats, summaries</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAiEnabled(!aiEnabled)}
                className={`w-12 h-6 rounded-full p-0.5 justify-center ${aiEnabled ? 'bg-primary' : 'bg-white/10'}`}
              >
                <View className={`w-5 h-5 rounded-full bg-background ${aiEnabled ? 'align-end ml-6' : 'align-start'}`} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 6: Profile Setup */}
        {step === 6 && (
          <View>
            <Text className="text-white text-xl font-bold mb-2">Profile Details</Text>
            <Text className="text-mutedText text-sm mb-4">Set your display name.</Text>
            <View className="bg-background rounded-xl border border-glassBorder p-4">
              <TextInput
                className="text-white text-base"
                placeholder="Enter your name..."
                placeholderTextColor="#A0A0A0"
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>
          </View>
        )}

        {/* Navigation buttons */}
        <View className="flex-row justify-between mt-8">
          {step > 0 ? (
            <TouchableOpacity onPress={handleBack} className="py-3 px-6 rounded-xl border border-glassBorder">
              <Text className="text-white font-semibold">Back</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <GlassButton
            title={step === 6 ? 'Get Started' : 'Continue'}
            onPress={handleNext}
            className="flex-1 ml-4"
          />
        </View>

      </GlassCard>
    </ScrollView>
  );
}
